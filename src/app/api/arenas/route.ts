import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const arenas = await prisma.arena.findMany({
      // Only include class metadata, NOT running orders — those are fetched separately
      include: {
        classes: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(arenas);
  } catch (error) {
    console.error('GET /api/arenas error:', error);
    return NextResponse.json({ error: 'Failed to fetch arenas' }, { status: 500 });
  }
}
