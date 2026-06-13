import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

export const revalidate = 0;

export const metadata = {
  title: 'Event Portal',
  description: 'Browse live, upcoming, and past equestrian show events. Real-time arena telemetry powered by LiveRide.',
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function Home() {
  const events = await prisma.event.findMany({
    include: {
      arenas: { include: { classes: true } },
      classes: true,
    },
    orderBy: { eventDate: 'asc' },
  });

  const liveEvents      = events.filter(e => e.status === 'ACTIVE');
  const upcomingEvents  = events.filter(e => e.status === 'UPCOMING');
  const completedEvents = events.filter(e => e.status === 'COMPLETE');

  return (
    <div className="space-y-12 animate-fade-in-up">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            LiveRide Show Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Equestrian Show Portal
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
            Monitor arena flow, track gate marshal queues, view live judge timing,
            and access public spectator dashboards across multiple event locations.
          </p>
        </div>

        {/* Live event count badge */}
        {liveEvents.length > 0 && (
          <div
            className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border animate-glow-live"
            style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}
          >
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <p className="text-emerald-700 font-black text-lg leading-none">{liveEvents.length}</p>
              <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Live Now</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Toyota Leaderboard Ad ─────────────────────────────────────────── */}
      <AdSpace sponsor="toyota" size="leaderboard" />

      {/* ── Live Events ──────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Live &amp; Active Shows
          </h2>
        </div>

        {liveEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 card-grid">
            {liveEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col card-hover animate-fade-in-up"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="badge-live px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider rounded-lg">
                      Live Now
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {event.qualifier}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug">{event.name}</h3>
                    <p className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.venue}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(event.eventDate)}
                    </p>
                  </div>

                  <div className="flex gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 font-semibold">
                    <span><strong className="text-slate-800 font-bold">{event.arenas.length}</strong> Arenas</span>
                    <span><strong className="text-slate-800 font-bold">{event.classes.length}</strong> Classes</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <Link
                    href={`/event/${event.id}`}
                    id={`live-event-spectator-${event.id}`}
                    className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-xs rounded-xl shadow-sm transition-colors duration-150 uppercase tracking-wider text-white"
                  >
                    Enter Spectator Board →
                  </Link>
                  <Link
                    href={`/admin/event/${event.id}`}
                    id={`live-event-admin-${event.id}`}
                    title="Admin event management"
                    className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 font-medium">
            No live events currently active.
          </div>
        )}
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upcoming Events
        </h2>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 card-grid">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col card-hover animate-fade-in-up"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black uppercase tracking-wider rounded-lg">
                      Scheduled
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {event.qualifier}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug">{event.name}</h3>
                    <p className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.venue}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(event.eventDate)}
                    </p>
                  </div>

                  <div className="flex gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 font-semibold">
                    <span><strong className="text-slate-800 font-bold">{event.arenas.length}</strong> Arenas</span>
                    <span><strong className="text-slate-800 font-bold">{event.classes.length}</strong> Classes</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <Link
                    href={`/event/${event.id}`}
                    id={`upcoming-event-${event.id}`}
                    className="flex-1 text-center py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm transition-colors uppercase tracking-wider"
                  >
                    View Show Roster →
                  </Link>
                  <Link
                    href={`/admin/event/${event.id}`}
                    id={`upcoming-event-admin-${event.id}`}
                    className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 font-medium">
            No upcoming events scheduled.
          </div>
        )}
      </section>

      {/* ── Completed Events ──────────────────────────────────────────────── */}
      {completedEvents.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completed Shows
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 card-grid">
            {completedEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col card-hover opacity-80 hover:opacity-100 transition-opacity"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-lg">
                      Archived
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {event.qualifier}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-800 leading-snug">{event.name}</h3>
                    <p className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.venue}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(event.eventDate)}
                    </p>
                  </div>

                  <div className="flex gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 font-semibold">
                    <span><strong className="text-slate-800 font-bold">{event.arenas.length}</strong> Arenas</span>
                    <span><strong className="text-slate-800 font-bold">{event.classes.length}</strong> Classes</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <Link
                    href={`/event/${event.id}`}
                    id={`archived-event-${event.id}`}
                    className="flex-1 text-center py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-colors uppercase tracking-wider"
                  >
                    View Results →
                  </Link>
                  <Link
                    href={`/admin/event/${event.id}`}
                    id={`archived-event-admin-${event.id}`}
                    className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
