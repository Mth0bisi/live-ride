import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { runningOrderId, faults, elapsedSeconds, capturedBy, status } = body;

    const currentOrder = await prisma.runningOrder.findUnique({
      where: { id: runningOrderId },
      include: { result: true }
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Guard: must be IN_ARENA to finish
    if (currentOrder.status !== 'IN_ARENA') {
      return NextResponse.json(
        { error: `Cannot finish a round that is in status: ${currentOrder.status}` },
        { status: 409 }
      );
    }

    // Guard: prevent double-creating a Result record
    if (currentOrder.result) {
      return NextResponse.json(
        { error: 'A result already exists for this round.' },
        { status: 409 }
      );
    }

    const finishTime = new Date();
    // Valid terminal statuses for a round
    const validFinishStatuses = ['FINISHED', 'ELIMINATED', 'RETIRED'];
    const finalStatus = validFinishStatuses.includes(status) ? status : 'FINISHED';

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.runningOrder.update({
        where: { id: runningOrderId },
        data: {
          status: finalStatus,
          finishedAt: finishTime
        }
      });

      await tx.timerEvent.create({
        data: {
          runningOrderId,
          eventType: 'FINISH',
          eventTime: finishTime,
          capturedBy: capturedBy || 'timer'
        }
      });

      await tx.statusHistory.create({
        data: {
          runningOrderId,
          oldStatus: currentOrder.status,
          newStatus: finalStatus,
          reason: `Round finished — status: ${finalStatus}`,
          changedBy: capturedBy || 'timer'
        }
      });

      // Create Result record
      await tx.result.create({
        data: {
          runningOrderId,
          elapsedSeconds: elapsedSeconds ?? null,
          faults: faults ?? null,
          resultStatus: 'PENDING',
          published: false
        }
      });

      return order;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('POST /api/timer/finish error:', error);
    return NextResponse.json({ error: 'Failed to finish timer' }, { status: 500 });
  }
}
