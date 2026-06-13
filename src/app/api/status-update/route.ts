import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  assertString,
  assertEnum,
  sanitiseReason,
  VALID_STATUSES,
} from '@/lib/validate';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { runningOrderId, status, reason, changedBy } = body;

    // ── Input validation ──────────────────────────────────────────────────────
    const idErr = assertString(runningOrderId, 'runningOrderId', 100);
    if (idErr) return NextResponse.json({ error: idErr.message }, { status: 400 });

    const statusErr = assertEnum(status, 'status', VALID_STATUSES);
    if (statusErr) return NextResponse.json({ error: statusErr.message }, { status: 400 });

    const cleanReason = sanitiseReason(reason);
    const cleanChangedBy =
      typeof changedBy === 'string' ? changedBy.trim().slice(0, 100) : 'system';

    // ── Fetch current order ────────────────────────────────────────────────────
    const currentOrder = await prisma.runningOrder.findUnique({
      where: { id: runningOrderId },
      include: { competitionClass: true },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Running order not found' }, { status: 404 });
    }

    // ── Business rule: only one rider IN_ARENA per arena ──────────────────────
    if (status === 'IN_ARENA') {
      const arenaId = currentOrder.competitionClass.arenaId;
      const alreadyInArena = await prisma.runningOrder.findFirst({
        where: {
          status: 'IN_ARENA',
          id: { not: runningOrderId },
          competitionClass: { is: { arenaId } },
        },
      });

      if (alreadyInArena) {
        return NextResponse.json(
          {
            error:
              'Another rider is already IN_ARENA for this arena. Please complete or hold that round first.',
          },
          { status: 409 }
        );
      }
    }

    // ── Transactional update + audit trail ────────────────────────────────────
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.runningOrder.update({
        where: { id: runningOrderId },
        data: {
          status,
          ...(status === 'CHECKED_IN' ? { checkedInAt: new Date() } : {}),
          ...(status === 'IN_ARENA' ? { startedAt: new Date() } : {}),
          ...(status === 'FINISHED' ? { finishedAt: new Date() } : {}),
        },
      });

      await tx.statusHistory.create({
        data: {
          runningOrderId,
          oldStatus: currentOrder.status,
          newStatus: status,
          reason: cleanReason,
          changedBy: cleanChangedBy,
        },
      });

      return order;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('POST /api/status-update error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
