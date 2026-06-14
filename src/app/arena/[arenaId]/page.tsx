'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdSpace from '@/components/AdSpace';

// Statuses that should never appear in the public upcoming list
const HIDDEN_FROM_PUBLIC = new Set([
  'SCRATCHED', 'NO_SHOW', 'HELD',
  'IN_ARENA', 'FINISHED', 'RESULT_PENDING',
  'RESULT_CONFIRMED', 'PUBLISHED', 'ELIMINATED', 'RETIRED',
]);

// Statuses considered "completed" for the results table
const COMPLETED_STATUSES = new Set([
  'FINISHED', 'ELIMINATED', 'RETIRED', 'RESULT_CONFIRMED', 'PUBLISHED',
]);

function StatusBadge({ status }: { status: string }) {
  const colours: Record<string, string> = {
    ACTIVE:       'bg-green-100 text-green-700 border-green-200',
    PAUSED:       'bg-yellow-100 text-yellow-700 border-yellow-200',
    ARENA_RAKE:   'bg-orange-100 text-orange-700 border-orange-200',
    COURSE_CHANGE:'bg-purple-100 text-purple-700 border-purple-200',
    COMPLETE:     'bg-slate-200 text-slate-600 border-slate-300',
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase border ${colours[status] ?? 'bg-slate-200 text-slate-700 border-slate-300'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function PublicArenaView() {
  const { arenaId } = useParams<{ arenaId: string }>();

  const [arena, setArena]                 = useState<any>(null);
  const [activeClass, setActiveClass]     = useState<any>(null);
  const [currentRider, setCurrentRider]   = useState<any>(null);
  const [upcomingRiders, setUpcomingRiders] = useState<any[]>([]);
  const [completedRiders, setCompletedRiders] = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const arenaRes = await fetch('/api/arenas');
      const arenas: any[] = await arenaRes.json();
      const currentArena = arenas.find((a) => a.id === arenaId);
      if (!currentArena) return;
      setArena(currentArena);

      const cls = currentArena.classes?.[0] ?? null;
      setActiveClass(cls);

      if (!cls) {
        setCurrentRider(null);
        setUpcomingRiders([]);
        setCompletedRiders([]);
        return;
      }

      const ordersRes = await fetch(`/api/running-orders?classId=${cls.id}`);
      const orders: any[] = await ordersRes.json();

      setCurrentRider(orders.find((o) => o.status === 'IN_ARENA') ?? null);

      const upcoming = orders
        .filter((o) => !HIDDEN_FROM_PUBLIC.has(o.status))
        .sort((a, b) => {
          const priority: Record<string, number> = { AT_GATE: 0, CHECKED_IN: 1, SCHEDULED: 2 };
          const pa = priority[a.status] ?? 99;
          const pb = priority[b.status] ?? 99;
          if (pa !== pb) return pa - pb;
          return a.plannedOrderNo - b.plannedOrderNo;
        })
        .slice(0, 5);
      setUpcomingRiders(upcoming);

      const completed = orders
        .filter((o) => COMPLETED_STATUSES.has(o.status))
        .sort((a, b) => {
          const ta = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
          const tb = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
          return tb - ta;
        });
      setCompletedRiders(completed);
    } catch (err) {
      console.error('PublicArenaView fetchData error:', err);
    } finally {
      setLoading(false);
    }
  }, [arenaId]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div
          className="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"
        />
        <p className="text-slate-400 font-medium animate-pulse">Loading arena live view…</p>
      </div>
    );
  }

  if (!arena) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-500 font-semibold">Arena not found</p>
        <Link href="/" className="text-blue-600 underline mt-2 inline-block text-sm">
          ← Back to all events
        </Link>
      </div>
    );
  }

  const isArenaLive = arena.status === 'ACTIVE';

  return (
    <div className="space-y-6 animate-fade-in-up">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className={`flex justify-between items-end border-b pb-4 ${
        isArenaLive ? 'border-emerald-200' : 'border-slate-200'
      }`}>
        <div>
          <Link
            href={`/event/${arena.eventId}`}
            className="text-blue-600 hover:text-blue-700 text-xs font-semibold uppercase tracking-wide mb-1 inline-flex items-center gap-1 transition-colors"
          >
            ← All Arenas
          </Link>
          <h1 className="text-3xl font-black text-slate-900">{arena.name}</h1>
          <p className="text-slate-400 mt-0.5 font-medium tracking-wide uppercase text-xs">
            {isArenaLive ? '● Live Feed' : 'Arena View'}
          </p>
        </div>
        <StatusBadge status={arena.status} />
      </div>

      {/* ── Class banner ─────────────────────────────────────────────── */}
      {activeClass && (
        <div className={`text-white p-5 rounded-2xl shadow-lg relative overflow-hidden ${
          isArenaLive ? 'bg-slate-900' : 'bg-slate-800'
        }`}>
          {isArenaLive && (
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          )}
          <div className="relative z-10">
            <p className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-1">Active Class</p>
            <h2 className="text-xl font-bold">{activeClass.name}</h2>
            <div className="flex flex-wrap gap-2 mt-3 text-xs font-medium text-slate-300">
              <span className="bg-slate-800 px-2.5 py-1 rounded-lg">Height: {activeClass.height}</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded-lg">Type: {activeClass.competitionType}</span>
              {activeClass.feiArticle && (
                <span className="bg-slate-800 px-2.5 py-1 rounded-lg">FEI: {activeClass.feiArticle}</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* ── In Arena Now ─────────────────────────────────────────── */}
          <div>
            <h3 className="text-base font-bold text-slate-700 mb-3 border-l-4 border-blue-600 pl-3">
              In Arena Now
            </h3>
            {currentRider ? (
              <div
                className="text-white rounded-2xl p-7 shadow-xl relative overflow-hidden in-arena-panel"
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)',
                }}
                id="current-rider-panel"
              >
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, #93c5fd 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}
                />
                <div className="relative z-10">
                  <p className="text-blue-200 font-bold uppercase tracking-widest text-xs mb-2">
                    Rider #{currentRider.rider.riderNo}
                  </p>
                  <h4 className="text-4xl font-black mb-1 leading-tight">{currentRider.rider.fullName}</h4>
                  <p className="text-xl text-blue-100 font-medium mb-5">on {currentRider.horse.name}</p>
                  <div className="inline-block bg-blue-950/50 px-4 py-2 rounded-lg text-sm font-medium border border-blue-700/30">
                    {currentRider.rider.school.name}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center"
                style={{ background: 'var(--surface)' }}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19H18.93c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">No rider currently in the arena</p>
              </div>
            )}
          </div>

          {/* ── Results ──────────────────────────────────────────────── */}
          <div>
            <h3 className="text-base font-bold text-slate-700 mb-3 border-l-4 border-green-500 pl-3">
              Results
            </h3>
            {completedRiders.length > 0 ? (
              <div
                className="rounded-2xl border border-slate-200 overflow-hidden"
                style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-card)' }}
              >
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-bold text-slate-600 w-10">#</th>
                      <th className="p-4 font-bold text-slate-600">Rider</th>
                      <th className="p-4 font-bold text-slate-600">Horse</th>
                      <th className="p-4 font-bold text-slate-600">Time</th>
                      <th className="p-4 font-bold text-slate-600">Faults</th>
                      <th className="p-4 font-bold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completedRiders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono text-slate-400 text-xs">{order.plannedOrderNo}</td>
                        <td className="p-4 font-semibold text-slate-900">{order.rider.fullName}</td>
                        <td className="p-4 text-slate-500">{order.horse.name}</td>
                        <td className="p-4 font-mono text-slate-700">
                          {order.result?.elapsedSeconds != null
                            ? `${Number(order.result.elapsedSeconds).toFixed(2)}s`
                            : '—'}
                        </td>
                        <td className="p-4">
                          {order.result?.faults != null ? (
                            <span className={`font-bold ${order.result.faults === 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {order.result.faults}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                            order.status === 'RESULT_CONFIRMED' ? 'bg-green-100 text-green-700' :
                            order.status === 'ELIMINATED'       ? 'bg-red-100 text-red-700' :
                            order.status === 'RETIRED'          ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-400 italic text-sm">No completed rounds yet.</p>
            )}
          </div>
        </div>

        {/* ── Right Sidebar ───────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Up Next */}
          <div>
            <h3 className="text-base font-bold text-slate-700 mb-3 border-l-4 border-slate-300 pl-3">
              Up Next
            </h3>
            <div
              className="rounded-2xl border border-slate-200 p-4 space-y-2"
              style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-card)' }}
            >
              {upcomingRiders.length > 0 ? (
                upcomingRiders.map((order, idx) => (
                  <div
                    key={order.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors animate-slide-in-right"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0 mt-0.5">
                      {order.plannedOrderNo}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{order.rider.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{order.horse.name}</p>
                      {order.status === 'AT_GATE' && (
                        <span className="text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">
                          At Gate
                        </span>
                      )}
                      {order.status === 'CHECKED_IN' && (
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">
                          Checked In
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-center py-6 text-sm">No upcoming riders</p>
              )}
            </div>
          </div>

          {/* Western Shoppe Sidebar Ad */}
          <AdSpace sponsor="western-shoppe" size="sidebar" />
        </div>
      </div>
    </div>
  );
}
