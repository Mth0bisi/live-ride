import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId');
  const arenaId = searchParams.get('arenaId');

  try {
    const where: any = {};

    if (classId) {
      where.classId = classId;
    } else if (arenaId) {
      // Prisma nested relation filter — must use `is`
      where.competitionClass = { is: { arenaId } };
    }

    const orders = await prisma.runningOrder.findMany({
      where,
      include: {
        rider: {
          include: { school: true }
        },
        horse: true,
        competitionClass: {
          include: { arena: true }
        },
        result: true,
        statusHistory: {
          orderBy: { changedAt: 'desc' }
        }
      },
      orderBy: {
        plannedOrderNo: 'asc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET /api/running-orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch running orders' }, { status: 500 });
  }
}
