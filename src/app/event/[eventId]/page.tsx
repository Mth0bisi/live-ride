import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSpace from '@/components/AdSpace';

export const revalidate = 0;

export function ArenaStatusBadge({ status }: { status: string }) {
  const colours: Record<string, string> = {
    ACTIVE:       'bg-green-100 text-green-700 border-green-200',
    PAUSED:       'bg-yellow-100 text-yellow-700 border-yellow-200',
    ARENA_RAKE:   'bg-orange-100 text-orange-700 border-orange-200',
    COURSE_CHANGE:'bg-purple-100 text-purple-700 border-purple-200',
    COMPLETE:     'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider border ${colours[status] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

interface EventPageProps {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({ params }: EventPageProps) {
  const { eventId } = await params;
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return { title: 'Event Not Found' };
  return {
    title: event.name,
    description: `Live arena feed for ${event.name} at ${event.venue}. Track riders, results, and gate queues in real time.`,
  };
}

export default async function EventDashboard({ params }: EventPageProps) {
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      arenas: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!event) notFound();

  // Fetch live data for each arena
  const arenasWithCurrentData = await Promise.all(
    event.arenas.map(async (arena) => {
      const activeClass = await prisma.competitionClass.findFirst({
        where: { arenaId: arena.id },
        orderBy: { sortOrder: 'asc' },
      });

      let currentRider = null;
      let nextRider = null;

      if (activeClass) {
        currentRider = await prisma.runningOrder.findFirst({
          where: { classId: activeClass.id, status: 'IN_ARENA' },
          include: { rider: true, horse: true },
        });

        const [atGate, checkedIn, scheduled] = await Promise.all([
          prisma.runningOrder.findFirst({
            where: { classId: activeClass.id, status: 'AT_GATE' },
            orderBy: { plannedOrderNo: 'asc' },
            include: { rider: true, horse: true },
          }),
          prisma.runningOrder.findFirst({
            where: { classId: activeClass.id, status: 'CHECKED_IN' },
            orderBy: { plannedOrderNo: 'asc' },
            include: { rider: true, horse: true },
          }),
          prisma.runningOrder.findFirst({
            where: { classId: activeClass.id, status: 'SCHEDULED' },
            orderBy: { plannedOrderNo: 'asc' },
            include: { rider: true, horse: true },
          }),
        ]);

        nextRider = atGate ?? checkedIn ?? scheduled ?? null;
      }

      return { ...arena, activeClass, currentRider, nextRider };
    })
  );

  const isLive = event.status === 'ACTIVE';

  return (
    <div className="space-y-8 animate-fade-in-up">

      {/* ── Back + Event Header ─────────────────────────────────────────── */}
      <div className="border-b border-slate-200 pb-6">
        <div className="mb-3">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit transition-colors"
          >
            ← Back to all Events
          </Link>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{event.name}</h1>
            <p className="text-lg text-slate-500 mt-2 font-medium">{event.venue} &nbsp;·&nbsp; {event.qualifier}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
            isLive
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 animate-pulse'
              : event.status === 'UPCOMING'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            {isLive ? '● Live Now' : event.status === 'UPCOMING' ? 'Scheduled' : 'Completed'}
          </span>
        </div>
      </div>

      {/* ── Main layout: arenas + sidebar ad ──────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Arena Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 card-grid">
            {arenasWithCurrentData.map(arena => {
              const isArenaActive = arena.status === 'ACTIVE';
              return (
                <Link key={arena.id} href={`/arena/${arena.id}`} className="block group" id={`arena-card-${arena.id}`}>
                  <div
                    className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-200 h-full flex flex-col card-hover animate-fade-in-up ${
                      isArenaActive ? 'arena-card-active border-emerald-200' : 'border-slate-200'
                    }`}
                    style={{ boxShadow: 'var(--shadow-card)' }}
                  >
                    {/* Arena header */}
                    <div className={`p-5 border-b flex justify-between items-center transition-colors ${
                      isArenaActive
                        ? 'bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100'
                        : 'bg-slate-50 border-slate-100 group-hover:bg-blue-50'
                    }`}>
                      <h2 className="text-lg font-bold text-slate-900 truncate pr-2">{arena.name}</h2>
                      <ArenaStatusBadge status={arena.status} />
                    </div>

                    <div className="p-5 flex-1 flex flex-col gap-4">
                      {/* Class */}
                      {arena.activeClass ? (
                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Class</p>
                          <p className="text-sm font-semibold text-slate-800 leading-snug">{arena.activeClass.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{arena.activeClass.height} &nbsp;·&nbsp; {arena.activeClass.competitionType}</p>
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-sm">No class scheduled</p>
                      )}

                      {/* In Arena */}
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">In Arena</p>
                        {arena.currentRider ? (
                          <div className={`rounded-xl p-3 border in-arena-panel ${
                            isArenaActive
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-blue-50 border-blue-100'
                          }`}>
                            <p className="font-bold text-blue-900 text-sm">{arena.currentRider.rider.fullName}</p>
                            <p className="text-xs text-blue-600 mt-0.5">on {arena.currentRider.horse.name}</p>
                          </div>
                        ) : (
                          <p className="text-slate-400 italic text-xs">No rider in arena</p>
                        )}
                      </div>

                      {/* Up Next */}
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Up Next</p>
                        {arena.nextRider ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-800 font-medium text-sm">{arena.nextRider.rider.fullName}</span>
                            <span className="text-slate-400 text-xs">({arena.nextRider.horse.name})</span>
                            {arena.nextRider.status === 'AT_GATE' && (
                              <span className="text-[10px] font-bold text-orange-600 uppercase bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">At Gate</span>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic text-xs">Waiting for gate check-in</p>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-3 border-t border-slate-100 text-xs text-blue-600 font-semibold group-hover:text-blue-700 transition-colors flex items-center gap-1">
                      View live feed →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Ad */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
          <AdSpace sponsor="western-shoppe" size="sidebar" />

          {/* Event info card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Event Info</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">Venue:</span> {event.venue}</p>
              <p><span className="font-semibold text-slate-800">Qualifier:</span> {event.qualifier}</p>
              <p><span className="font-semibold text-slate-800">Arenas:</span> {event.arenas.length}</p>
              <p><span className="font-semibold text-slate-800">Status:</span>{' '}
                <span className={isLive ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                  {isLive ? 'Live' : event.status}
                </span>
              </p>
            </div>
            <Link
              href={`/admin/event/${event.id}`}
              id={`event-admin-link-${event.id}`}
              className="mt-3 block text-center py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
            >
              Admin Dashboard →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
