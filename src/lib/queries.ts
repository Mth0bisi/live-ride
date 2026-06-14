/**
 * queries.ts — Optimised Prisma query helpers for LiveRide.
 *
 * Design principles:
 * - Use select to fetch only required fields (avoid over-fetching)
 * - Use where to filter early at DB level
 * - Avoid N+1 by using nested include/select with intentional depth
 * - Use orderBy for predictable output
 * - Gate public results by published=true
 * - All helpers are integrated with the cache layer
 *
 * Helper functions:
 *   getActiveEvents()             — landing page live events list
 *   getAllEventsPublic()          — all events for landing page (all statuses)
 *   getEventLiveSummary(id)       — event + arenas + classes overview
 *   getPublicResults(classId)     — published results for a class
 *   getRunningOrderForClass(id)   — running order with rider + horse
 *   getArenaClasses(eventId)      — classes grouped by arena
 */

import { prisma } from '@/lib/prisma';
import {
  getOrSetCache,
  CacheKeys,
  CacheTTL,
} from '@/lib/cache';

// ─── Types returned by helpers ───────────────────────────────────────────────

export type EventSummary = {
  id: string;
  name: string;
  venue: string;
  eventDate: Date;
  qualifier: string;
  status: string;
  arenaCount: number;
  classCount: number;
};

export type EventLiveSummary = {
  id: string;
  name: string;
  venue: string;
  eventDate: Date;
  qualifier: string;
  status: string;
  arenas: {
    id: string;
    name: string;
    discipline: string;
    status: string;
    sortOrder: number;
    classes: {
      id: string;
      classCode: string;
      name: string;
      height: string;
      competitionType: string;
      scheduledStartTime: string;
      expectedRiders: number;
      sortOrder: number;
      status: string;
    }[];
  }[];
};

export type PublicResultRow = {
  id: string;
  elapsedSeconds: number | null;
  faults: number | null;
  penalties: number | null;
  placing: number | null;
  resultStatus: string;
  published: boolean;
  runningOrder: {
    plannedOrderNo: number;
    rider: { riderNo: string; fullName: string };
    horse: { name: string };
    competitionClass: {
      name: string;
      classCode: string;
      arena: { name: string };
    };
  };
};

export type RunningOrderRow = {
  id: string;
  plannedOrderNo: number;
  status: string;
  checkedInAt: Date | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  notes: string | null;
  rider: { id: string; riderNo: string; fullName: string; school: { name: string } };
  horse: { id: string; name: string; type: string };
  result: {
    elapsedSeconds: number | null;
    faults: number | null;
    penalties: number | null;
    placing: number | null;
    resultStatus: string;
    published: boolean;
  } | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fetch active (ACTIVE status) events — used on the landing page live section.
 * Cached for 60 seconds.
 */
export async function getActiveEvents(): Promise<EventSummary[]> {
  return getOrSetCache(CacheKeys.activeEvents(), CacheTTL.activeEvents, async () => {
    const events = await prisma.event.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id:        true,
        name:      true,
        venue:     true,
        eventDate: true,
        qualifier: true,
        status:    true,
        _count: {
          select: { arenas: true, classes: true },
        },
      },
      orderBy: { eventDate: 'asc' },
    });

    return events.map(e => ({
      id:         e.id,
      name:       e.name,
      venue:      e.venue,
      eventDate:  e.eventDate,
      qualifier:  e.qualifier,
      status:     e.status,
      arenaCount: e._count.arenas,
      classCount: e._count.classes,
    }));
  });
}

/**
 * Fetch all events for the public landing page (all statuses).
 * Cached for 60 seconds.
 */
export async function getAllEventsPublic(): Promise<EventSummary[]> {
  return getOrSetCache(CacheKeys.allEvents(), CacheTTL.allEvents, async () => {
    const events = await prisma.event.findMany({
      select: {
        id:        true,
        name:      true,
        venue:     true,
        eventDate: true,
        qualifier: true,
        status:    true,
        _count: {
          select: { arenas: true, classes: true },
        },
      },
      orderBy: { eventDate: 'asc' },
    });

    return events.map(e => ({
      id:         e.id,
      name:       e.name,
      venue:      e.venue,
      eventDate:  e.eventDate,
      qualifier:  e.qualifier,
      status:     e.status,
      arenaCount: e._count.arenas,
      classCount: e._count.classes,
    }));
  });
}

/**
 * Fetch a full event live summary — event + arenas + classes.
 * Cached for 3 seconds (live data).
 */
export async function getEventLiveSummary(eventId: string): Promise<EventLiveSummary | null> {
  return getOrSetCache(
    CacheKeys.eventLiveSummary(eventId),
    CacheTTL.eventLiveSummary,
    async () => {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
          id:        true,
          name:      true,
          venue:     true,
          eventDate: true,
          qualifier: true,
          status:    true,
          arenas: {
            select: {
              id:         true,
              name:       true,
              discipline: true,
              status:     true,
              sortOrder:  true,
              classes: {
                select: {
                  id:                 true,
                  classCode:          true,
                  name:               true,
                  height:             true,
                  competitionType:    true,
                  scheduledStartTime: true,
                  expectedRiders:     true,
                  sortOrder:          true,
                  status:             true,
                },
                orderBy: { sortOrder: 'asc' },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
      return event;
    },
  );
}

/**
 * Fetch published results for a class — public spectator view.
 * Selects only fields needed for public display.
 * Cached for 5 seconds.
 */
export async function getPublicResults(classId: string): Promise<PublicResultRow[]> {
  return getOrSetCache(
    CacheKeys.publicResults(classId),
    CacheTTL.publicResults,
    async () => {
      const results = await prisma.result.findMany({
        where: {
          published: true,
          runningOrder: { classId },
        },
        select: {
          id:             true,
          elapsedSeconds: true,
          faults:         true,
          penalties:      true,
          placing:        true,
          resultStatus:   true,
          published:      true,
          runningOrder: {
            select: {
              plannedOrderNo: true,
              rider: {
                select: { riderNo: true, fullName: true },
              },
              horse: {
                select: { name: true },
              },
              competitionClass: {
                select: {
                  name:      true,
                  classCode: true,
                  arena: { select: { name: true } },
                },
              },
            },
          },
        },
        orderBy: [
          { faults:         'asc' },
          { penalties:      'asc' },
          { elapsedSeconds: 'asc' },
        ],
      });

      return results as PublicResultRow[];
    },
  );
}

/**
 * Fetch the full running order for a class — gate marshal / timer view.
 * Cached for 3 seconds (near-real-time).
 */
export async function getRunningOrderForClass(classId: string): Promise<RunningOrderRow[]> {
  return getOrSetCache(
    CacheKeys.runningOrder(classId),
    CacheTTL.runningOrder,
    async () => {
      const orders = await prisma.runningOrder.findMany({
        where: { classId },
        select: {
          id:             true,
          plannedOrderNo: true,
          status:         true,
          checkedInAt:    true,
          startedAt:      true,
          finishedAt:     true,
          notes:          true,
          rider: {
            select: {
              id:       true,
              riderNo:  true,
              fullName: true,
              school: { select: { name: true } },
            },
          },
          horse: {
            select: { id: true, name: true, type: true },
          },
          result: {
            select: {
              elapsedSeconds: true,
              faults:         true,
              penalties:      true,
              placing:        true,
              resultStatus:   true,
              published:      true,
            },
          },
        },
        orderBy: { plannedOrderNo: 'asc' },
      });

      return orders as RunningOrderRow[];
    },
  );
}

/**
 * Fetch all classes for an event grouped by arena — schedule view.
 * Cached for 60 seconds.
 */
export async function getArenaClasses(eventId: string) {
  return getOrSetCache(
    CacheKeys.arenaClasses(eventId),
    CacheTTL.arenaClasses,
    () =>
      prisma.arena.findMany({
        where: { eventId },
        select: {
          id:         true,
          name:       true,
          discipline: true,
          status:     true,
          sortOrder:  true,
          classes: {
            select: {
              id:                 true,
              classCode:          true,
              name:               true,
              height:             true,
              competitionType:    true,
              scheduledStartTime: true,
              expectedRiders:     true,
              sortOrder:          true,
              status:             true,
              _count: { select: { runningOrders: true } },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      }),
  );
}
