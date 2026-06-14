import { NextResponse } from 'next/server';
import { getAllEventsPublic } from '@/lib/queries';
import { invalidateCache, CacheKeys } from '@/lib/cache';

/**
 * GET /api/events
 * Returns all events with arena + class counts.
 * Uses optimised query helper with cache (60s TTL).
 *
 * Supports ?bust=1 to force cache invalidation (admin use only).
 * TODO: Protect cache bust with admin role check when auth is wired.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bust = searchParams.get('bust');

    if (bust === '1') {
      // TODO: Add admin role check here before allowing cache bust
      await invalidateCache(CacheKeys.allEvents());
    }

    const events = await getAllEventsPublic();
    return NextResponse.json(events);
  } catch (error) {
    console.error('GET /api/events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
