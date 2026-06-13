import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const arenaId = searchParams.get('arenaId');

  try {
    const query: any = {};
    if (arenaId) query.arenaId = arenaId;
    
    const classes = await prisma.competitionClass.findMany({
      where: query,
      orderBy: {
        sortOrder: 'asc'
      }
    });
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classId, status } = body;

    const updatedClass = await prisma.competitionClass.update({
      where: { id: classId },
      data: { status }
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('POST /api/classes error:', error);
    return NextResponse.json({ error: 'Failed to update class status' }, { status: 500 });
  }
}
