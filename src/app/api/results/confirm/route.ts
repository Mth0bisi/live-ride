import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { runningOrderId, confirmedBy } = body;

    const currentOrder = await prisma.runningOrder.findUnique({
      where: { id: runningOrderId },
      include: { result: true }
    });

    if (!currentOrder || !currentOrder.result) {
      return NextResponse.json({ error: 'Order or Result not found' }, { status: 404 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.result.update({
        where: { runningOrderId },
        data: {
          resultStatus: 'CONFIRMED',
          published: true
        }
      });

      const order = await tx.runningOrder.update({
        where: { id: runningOrderId },
        data: {
          status: 'RESULT_CONFIRMED'
        }
      });

      await tx.statusHistory.create({
        data: {
          runningOrderId,
          oldStatus: currentOrder.status,
          newStatus: 'RESULT_CONFIRMED',
          reason: 'Result confirmed by judge',
          changedBy: confirmedBy || 'judge'
        }
      });

      return order;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to confirm result' }, { status: 500 });
  }
}
