import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { arenaId, status } = body;

    const updatedArena = await prisma.arena.update({
      where: { id: arenaId },
      data: { status }
    });

    return NextResponse.json(updatedArena);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update arena' }, { status: 500 });
  }
}
