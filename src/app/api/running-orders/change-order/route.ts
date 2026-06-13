import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { assertString, assertPositiveInt, sanitiseReason } from '@/lib/validate';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { runningOrderId, newPlannedOrderNo, reason, changedBy } = body;

    // ── Input validation ────────────────────────────────────────────────────
    const idErr = assertString(runningOrderId, 'runningOrderId', 100);
    if (idErr) return NextResponse.json({ error: idErr.message }, { status: 400 });

    const orderErr = assertPositiveInt(newPlannedOrderNo, 'newPlannedOrderNo');
    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 400 });

    const reasonErr = assertString(reason, 'reason', 500);
    if (reasonErr) return NextResponse.json({ error: 'A reason for the order change is required.' }, { status: 400 });

    const cleanReason = sanitiseReason(reason);
    const cleanChangedBy =
      typeof changedBy === 'string' ? changedBy.trim().slice(0, 100) : 'admin';

    const currentOrder = await prisma.runningOrder.findUnique({
      where: { id: runningOrderId },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (currentOrder.plannedOrderNo === newPlannedOrderNo) {
      return NextResponse.json(currentOrder);
    }

    // Find if there is another order already occupying the target position in the same class
    const targetOrder = await prisma.runningOrder.findFirst({
      where: {
        classId: currentOrder.classId,
        plannedOrderNo: newPlannedOrderNo
      }
    });

    const updatedOrder = await prisma.$transaction(async (tx) => {
      if (targetOrder) {
        // Swap plannedOrderNo values
        // To bypass the unique constraint, temporarily assign targetOrder's position to a large negative number
        await tx.runningOrder.update({
          where: { id: targetOrder.id },
          data: { plannedOrderNo: -999 }
        });

        // Set currentOrder to the new position
        const order = await tx.runningOrder.update({
          where: { id: runningOrderId },
          data: {
            plannedOrderNo: newPlannedOrderNo,
            orderChanged: true,
            orderChangeReason: cleanReason
          }
        });

        // Set targetOrder to currentOrder's old position
        await tx.runningOrder.update({
          where: { id: targetOrder.id },
          data: {
            plannedOrderNo: currentOrder.plannedOrderNo,
            orderChanged: true,
            orderChangeReason: `Swapped with ${currentOrder.plannedOrderNo}: ${cleanReason}`
          }
        });

        // Create StatusHistory for BOTH running orders to log the swap audit trail
        await tx.statusHistory.create({
          data: {
            runningOrderId: currentOrder.id,
            oldStatus: currentOrder.status,
            newStatus: currentOrder.status,
            reason: `Order changed to ${newPlannedOrderNo} (Swapped with Rider #${targetOrder.plannedOrderNo}): ${cleanReason}`,
            changedBy: cleanChangedBy
          }
        });

        await tx.statusHistory.create({
          data: {
            runningOrderId: targetOrder.id,
            oldStatus: targetOrder.status,
            newStatus: targetOrder.status,
            reason: `Order changed to ${currentOrder.plannedOrderNo} (Swapped with Rider #${currentOrder.plannedOrderNo}): ${reason}`,
            changedBy: changedBy || 'admin'
          }
        });

        return order;
      } else {
        // No conflict, just update position directly
        const order = await tx.runningOrder.update({
          where: { id: runningOrderId },
          data: {
            plannedOrderNo: newPlannedOrderNo,
            orderChanged: true,
            orderChangeReason: reason
          }
        });

        await tx.statusHistory.create({
          data: {
            runningOrderId,
            oldStatus: currentOrder.status,
            newStatus: currentOrder.status,
            reason: `Order changed to ${newPlannedOrderNo}: ${cleanReason}`,
            changedBy: cleanChangedBy
          }
        });

        return order;
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('POST /api/running-orders/change-order error:', error);
    return NextResponse.json({ error: 'Failed to change order' }, { status: 500 });
  }
}
