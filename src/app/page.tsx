import { getAllEventsPublic } from '@/lib/queries';
import type { EventSummary } from '@/lib/queries';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';
import { cookies } from 'next/headers';

export const revalidate = 0; // Dynamic — prevents local prerender DB errors; ISR configured via cache layer

export const metadata = {
  title: 'Event Portal',
  description:
    'Browse live, upcoming, and past equestrian show events. Real-time arena telemetry powered by LiveRide.',
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Reusable SVG icons ───────────────────────────────────────────────────────

function LocationIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

// ─── Auth-gated event link: redirects unauthenticated users to /login ─────────

function LiveEventCTA({ eventId, isLoggedIn }: { eventId: string; isLoggedIn: boolean }) {
  const href = isLoggedIn ? `/event/${eventId}` : `/login?return=/event/${eventId}`;
  return (
    <Link
      href={href}
      id={`live-event-view-${eventId}`}
      className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-xs rounded-xl shadow-sm transition-colors duration-150 uppercase tracking-wider text-white"
    >
      View Live Event →
    </Link>
  );
}

// ─── Event card ───────────────────────────────────────────────────────────────

type CardVariant = 'live' | 'upcoming' | 'completed';

function EventCard({ event, variant, isLoggedIn }: { event: EventSummary; variant: CardVariant; isLoggedIn: boolean }) {
  const isLive      = variant === 'live';
  const isCompleted = variant === 'completed';
  const href = isLoggedIn ? `/event/${event.id}` : `/login?return=/event/${event.id}`;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col card-hover animate-fade-in-up ${isCompleted ? 'opacity-80 hover:opacity-100 transition-opacity' : ''}`}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="p-6 space-y-4 flex-1">
        {/* Badge row */}
        <div className="flex justify-between items-start">
          {isLive && (
            <span className="badge-live px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider rounded-lg">
              Live Now
            </span>
          )}
          {!isLive && !isCompleted && (
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black uppercase tracking-wider rounded-lg">
              Scheduled
            </span>
          )}
          {isCompleted && (
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-lg">
              Archived
            </span>
          )}
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            {event.qualifier}
          </span>
        </div>

        {/* Name + venue + date */}
        <div>
          <h3 className={`text-xl font-bold leading-snug ${isCompleted ? 'text-slate-800' : 'text-slate-900'}`}>
            {event.name}
          </h3>
          <p className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <LocationIcon />
            {event.venue}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
            <CalendarIcon />
            {formatDate(event.eventDate)}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 font-semibold">
          <span><strong className="text-slate-800 font-bold">{event.arenaCount}</strong> Arenas</span>
          <span><strong className="text-slate-800 font-bold">{event.classCount}</strong> Classes</span>
        </div>
      </div>

      {/* CTA footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        {isLive && <LiveEventCTA eventId={event.id} isLoggedIn={isLoggedIn} />}

        {!isLive && !isCompleted && (
          <Link
            href={href}
            id={`upcoming-event-${event.id}`}
            className="block text-center py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm transition-colors uppercase tracking-wider"
          >
            View Show Roster →
          </Link>
        )}

        {isCompleted && (
          <Link
            href={href}
            id={`archived-event-${event.id}`}
            className="block text-center py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-colors uppercase tracking-wider"
          >
            View Results →
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  // Use optimised query helper — reads from cache or falls back to DB
  const events = await getAllEventsPublic();

  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('lr_uid')?.value;

  const liveEvents      = events.filter(e => e.status === 'ACTIVE');
  const upcomingEvents  = events.filter(e => e.status === 'UPCOMING');
  const completedEvents = events.filter(e => e.status === 'COMPLETE');

  return (
    <div className="space-y-12 animate-fade-in-up">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
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

        {/* Live count badge */}
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

      {/* ── Western Shoppe Top Banner Ad ────────────────────────────────────── */}
      <AdSpace placement="banner" />

      {/* ── Auth CTA Banner (Hidden if Logged In) ─────────────────────────────── */}
      {!isLoggedIn && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 rounded-2xl border"
          style={{
            background:   'linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 100%)',
            borderColor:  '#bfdbfe',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15a1 1 0 01-.553.894L15 13.5M3 8.82a1 1 0 01.553-.894L9 5.5M3 8.82V15a1 1 0 00.553.894L9 18.5m0-13l6 3m-6 3l6 3m-6 0V21" />
              </svg>
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm">
                Login or sign up to view live event updates.
              </p>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                Real-time arena feeds, running orders, and live results — all in one place.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <Link
              href="/login"
              id="home-cta-login"
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              id="home-cta-signup"
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-colors"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* ── Live Events ────────────────────────────────────────────────────── */}
      <section className="space-y-5" aria-label="Live and active shows">
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
              <EventCard key={event.id} event={event} variant="live" isLoggedIn={isLoggedIn} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 font-medium">
            No live events currently active.
          </div>
        )}
      </section>

      {/* ── Upcoming Events ─────────────────────────────────────────────────── */}
      <section className="space-y-5" aria-label="Upcoming events">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upcoming Events
        </h2>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 card-grid">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} variant="upcoming" isLoggedIn={isLoggedIn} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 font-medium">
            No upcoming events scheduled.
          </div>
        )}
      </section>

      {/* ── Completed Events ────────────────────────────────────────────────── */}
      {completedEvents.length > 0 && (
        <section className="space-y-5" aria-label="Completed shows">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completed Shows
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 card-grid">
            {completedEvents.map(event => (
              <EventCard key={event.id} event={event} variant="completed" isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
