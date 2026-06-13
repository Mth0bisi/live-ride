import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { runningOrderId, capturedBy } = body;

    const currentOrder = await prisma.runningOrder.findUnique({
      where: { id: runningOrderId },
      include: { competitionClass: true }
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // BUSINESS RULE: Only one rider can be IN_ARENA per arena at a time.
    // Check if another rider in the same arena is already IN_ARENA.
    const arenaId = currentOrder.competitionClass.arenaId;
    const alreadyInArena = await prisma.runningOrder.findFirst({
      where: {
        status: 'IN_ARENA',
        id: { not: runningOrderId }, // exclude current order
        competitionClass: {
          is: { arenaId }
        }
      }
    });

    if (alreadyInArena) {
      return NextResponse.json(
        { error: 'Another rider is already IN_ARENA for this arena. Finish that round first.' },
        { status: 409 }
      );
    }

    const startTime = new Date();

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.runningOrder.update({
        where: { id: runningOrderId },
        data: {
          status: 'IN_ARENA',
          startedAt: startTime
        }
      });

      await tx.timerEvent.create({
        data: {
          runningOrderId,
          eventType: 'START',
          eventTime: startTime,
          capturedBy: capturedBy || 'timer'
        }
      });

      await tx.statusHistory.create({
        data: {
          runningOrderId,
          oldStatus: currentOrder.status,
          newStatus: 'IN_ARENA',
          reason: 'Round started',
          changedBy: capturedBy || 'timer'
        }
      });

      return order;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('POST /api/timer/start error:', error);
    return NextResponse.json({ error: 'Failed to start timer' }, { status: 500 });
  }
}
