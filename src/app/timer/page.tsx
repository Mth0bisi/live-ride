'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

// The timer only operates on riders who need to ride or are riding
const TIMER_ACTIONABLE_STATUSES = new Set(['AT_GATE', 'CHECKED_IN', 'SCHEDULED']);
const PENDING_CONFIRMATION_STATUSES = new Set(['FINISHED', 'ELIMINATED', 'RETIRED']);

// ─── Sub-components ────────────────────────────────────────────────────────────

function RiderCard({ rider, horse, school, riderNo }: any) {
  return (
    <div>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Rider {riderNo}</p>
      <p className="text-3xl font-black text-slate-900 leading-tight">{rider.fullName}</p>
      <p className="text-lg text-slate-500 font-medium mt-1">on {horse.name}</p>
      <p className="text-xs text-slate-400 mt-2">{school?.name}</p>
    </div>
  );
}

export default function TimerDashboard() {
  const [arenas, setArenas] = useState<any[]>([]);
  const [selectedArenaId, setSelectedArenaId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [faults, setFaults] = useState<number>(0);
  const [timeStr, setTimeStr] = useState<string>('');

  const selectedClassIdRef = useRef(selectedClassId);
  selectedClassIdRef.current = selectedClassId;

  // ─── Data fetching ───────────────────────────────────────────────────────────

  const fetchArenas = useCallback(async () => {
    try {
      const res = await fetch('/api/arenas');
      const data: any[] = await res.json();
      setArenas(data);
      // Auto-select on first load only
      setSelectedArenaId(prev => {
        if (prev) return prev;
        if (data.length > 0) {
          const firstClass = data[0].classes?.[0];
          if (firstClass) setSelectedClassId(firstClass.id);
          return data[0].id;
        }
        return prev;
      });
    } catch (err) {
      console.error('Timer: fetchArenas error', err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    const classId = selectedClassIdRef.current;
    if (!classId) return;
    try {
      const res = await fetch(`/api/running-orders?classId=${classId}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Timer: fetchOrders error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArenas();
  }, [fetchArenas]);

  useEffect(() => {
    if (!selectedClassId) return;
    setLoading(true);
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [selectedClassId, fetchOrders]);

  // ─── Arena / class selection ─────────────────────────────────────────────────

  const handleArenaSelect = (arenaId: string) => {
    const arena = arenas.find(a => a.id === arenaId);
    setSelectedArenaId(arenaId);
    const firstClass = arena?.classes?.[0];
    if (firstClass) setSelectedClassId(firstClass.id);
    else setSelectedClassId('');
    setOrders([]);
    setLoading(true);
  };

  // ─── Timer actions ───────────────────────────────────────────────────────────

  const startRound = async (orderId: string) => {
    setActionError(null);
    setActionLoading(true);
    try {
      const res = await fetch('/api/timer/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runningOrderId: orderId, capturedBy: 'Timer 1' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to start round');
      await fetchOrders();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const finishRound = async (orderId: string, status = 'FINISHED') => {
    setActionError(null);
    setActionLoading(true);
    try {
      const res = await fetch('/api/timer/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runningOrderId: orderId,
          faults,
          elapsedSeconds: timeStr ? parseFloat(timeStr) : null,
          status,
          capturedBy: 'Timer 1'
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to finish round');
      setFaults(0);
      setTimeStr('');
      await fetchOrders();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmResult = async (orderId: string) => {
    setActionError(null);
    setActionLoading(true);
    try {
      const res = await fetch('/api/results/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runningOrderId: orderId, confirmedBy: 'Judge 1' })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to confirm result');
      await fetchOrders();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Derived state ───────────────────────────────────────────────────────────

  const currentArena = arenas.find(a => a.id === selectedArenaId);

  // The rider currently IN_ARENA — highest priority
  const inArenaRider = orders.find(o => o.status === 'IN_ARENA');

  // The next rider to start: AT_GATE first, then CHECKED_IN, then SCHEDULED
  // Only shown when NO rider is IN_ARENA
  const nextToStart = !inArenaRider
    ? (orders.find(o => o.status === 'AT_GATE') ??
       orders.find(o => o.status === 'CHECKED_IN') ??
       orders.find(o => o.status === 'SCHEDULED'))
    : null;

  // The rider the timer UI acts on
  const activeRider = inArenaRider ?? nextToStart;
  const canStart = !inArenaRider && !!nextToStart;

  // Rounds finished but not yet judge-confirmed
  const pendingConfirmation = orders.filter(
    o => PENDING_CONFIRMATION_STATUSES.has(o.status) && o.result?.resultStatus === 'PENDING'
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900">Timer &amp; Judge</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Start rounds, capture results, and confirm scores</p>
      </div>

      {/* Error banner */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex justify-between items-center">
          <span>⚠️ {actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-600 font-bold text-lg leading-none">×</button>
        </div>
      )}

      {/* Arena selector */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Arena</p>
        <div className="flex flex-wrap gap-2">
          {arenas.map(arena => (
            <button
              key={arena.id}
              onClick={() => handleArenaSelect(arena.id)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                selectedArenaId === arena.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {arena.name}
            </button>
          ))}
        </div>
      </div>

      {/* Class selector */}
      {currentArena?.classes?.length > 1 && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Class</p>
          <div className="flex flex-wrap gap-2">
            {currentArena.classes.map((cls: any) => (
              <button
                key={cls.id}
                onClick={() => { setSelectedClassId(cls.id); setOrders([]); setLoading(true); }}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedClassId === cls.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-3" />
          <p className="text-slate-400 font-medium">Loading riders…</p>
        </div>
      ) : !selectedClassId ? (
        <div className="text-center py-16 text-slate-400">Select an arena to begin.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── Left: Active rider panel ───────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {inArenaRider ? 'In Arena' : canStart ? 'Next Up' : 'Current Rider'}
              </h2>
              {inArenaRider && (
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase animate-pulse tracking-wider">
                  IN ARENA
                </span>
              )}
              {canStart && (
                <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full uppercase tracking-wider">
                  {nextToStart!.status.replace(/_/g, ' ')}
                </span>
              )}
            </div>

            {activeRider ? (
              <>
                <RiderCard
                  rider={activeRider.rider}
                  horse={activeRider.horse}
                  school={activeRider.rider.school}
                  riderNo={activeRider.rider.riderNo}
                />

                {/* ── START button ── */}
                {canStart && (
                  <button
                    id="timer-start-btn"
                    onClick={() => startRound(activeRider.id)}
                    disabled={actionLoading}
                    className="w-full py-6 disabled:opacity-50 text-white font-black text-2xl rounded-2xl shadow-xl transition-all duration-150 tracking-wide flex items-center justify-center gap-3"
                    style={{
                      background: actionLoading
                        ? '#16a34a'
                        : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                      boxShadow: '0 8px 32px rgba(34,197,94,0.35)',
                    }}
                  >
                    {actionLoading ? (
                      <><span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> Starting…</>
                    ) : (
                      <><span className="text-3xl">▶</span> START ROUND</>
                    )}
                  </button>
                )}

                {/* ── FINISH controls (shown when rider IS in arena) ──────── */}
                {inArenaRider && (
                  <div className="space-y-4">
                    {/* Time & Faults capture */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Time (s)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={timeStr}
                          onChange={e => setTimeStr(e.target.value)}
                          className="w-full text-2xl font-mono border-2 border-slate-200 rounded-xl p-3 focus:border-blue-500 outline-none"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Faults</label>
                        <div className="flex items-stretch border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500">
                          <button
                            onClick={() => setFaults(f => Math.max(0, f - 4))}
                            className="w-12 bg-slate-100 hover:bg-slate-200 text-xl font-bold text-slate-600 transition-colors"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={faults}
                            onChange={e => setFaults(Math.max(0, parseInt(e.target.value) || 0))}
                            className="flex-1 h-14 text-center text-2xl font-bold outline-none"
                          />
                          <button
                            onClick={() => setFaults(f => f + 4)}
                            className="w-12 bg-slate-100 hover:bg-slate-200 text-xl font-bold text-slate-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Finish actions */}
                    <button
                      id="timer-finish-btn"
                      onClick={() => finishRound(activeRider.id, 'FINISHED')}
                      disabled={actionLoading}
                      className="w-full py-5 disabled:opacity-50 text-white font-black text-xl rounded-xl shadow-xl transition-all duration-150 flex items-center justify-center gap-3"
                      style={{
                        background: actionLoading
                          ? '#dc2626'
                          : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                        boxShadow: '0 6px 24px rgba(239,68,68,0.3)',
                      }}
                    >
                      {actionLoading ? (
                        <><span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                      ) : (
                        <><span className="text-2xl">■</span> FINISH ROUND</>
                      )}
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id="timer-eliminated-btn"
                        onClick={() => finishRound(activeRider.id, 'ELIMINATED')}
                        disabled={actionLoading}
                        className="py-3 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
                      >
                        Eliminated
                      </button>
                      <button
                        id="timer-retired-btn"
                        onClick={() => finishRound(activeRider.id, 'RETIRED')}
                        disabled={actionLoading}
                        className="py-3 bg-slate-500 hover:bg-slate-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
                      >
                        Retired
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-10 text-center">
                <p className="text-slate-400 font-medium">No riders ready.</p>
                <p className="text-xs text-slate-300 mt-1">Gate marshal must check riders in first.</p>
              </div>
            )}
          </div>

          {/* ── Right: Pending confirmations ────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pending Judge Confirmation</h2>
            {pendingConfirmation.length > 0 ? (
              <div className="space-y-4">
                {pendingConfirmation.map(order => (
                  <div key={order.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="font-bold text-slate-900">{order.rider.fullName}</p>
                    <p className="text-sm text-slate-500 mb-3">{order.horse.name}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="font-mono text-sm bg-white border border-slate-200 px-2 py-1 rounded font-bold">
                        {order.result?.elapsedSeconds != null
                          ? `${Number(order.result.elapsedSeconds).toFixed(2)}s`
                          : 'No time'}
                      </span>
                      <span className="font-mono text-sm bg-white border border-slate-200 px-2 py-1 rounded font-bold">
                        {order.result?.faults != null ? `${order.result.faults} faults` : 'No faults'}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        order.status === 'ELIMINATED' ? 'bg-red-100 text-red-700' :
                        order.status === 'RETIRED' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <button
                      id={`timer-confirm-btn-${order.id}`}
                      onClick={() => confirmResult(order.id)}
                      disabled={actionLoading}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-sm transition-colors"
                    >
                      ✓ Judge Confirm &amp; Publish
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-slate-400 italic text-sm">No rounds awaiting confirmation.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
