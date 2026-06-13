'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import AdSpace from '@/components/AdSpace';

const TERMINAL_STATUSES = new Set([
  'IN_ARENA', 'FINISHED', 'ELIMINATED', 'RETIRED',
  'RESULT_PENDING', 'RESULT_CONFIRMED', 'PUBLISHED',
]);

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  SCHEDULED:  { label: 'Scheduled',  bg: '#1e293b', text: '#94a3b8', dot: '#475569' },
  CHECKED_IN: { label: 'Checked In', bg: '#1e3a5f', text: '#60a5fa', dot: '#3b82f6' },
  AT_GATE:    { label: 'At Gate',    bg: '#431407', text: '#fb923c', dot: '#f97316' },
  HELD:       { label: 'Held',       bg: '#422006', text: '#fbbf24', dot: '#f59e0b' },
  SCRATCHED:  { label: 'Scratched',  bg: '#1f1215', text: '#f87171', dot: '#ef4444' },
  NO_SHOW:    { label: 'No Show',    bg: '#1a1a1a', text: '#9ca3af', dot: '#6b7280' },
};

function StatusChip({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.SCHEDULED;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.dot}40` }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

export default function GateMarshalDashboard() {
  const [arenas, setArenas]                   = useState<any[]>([]);
  const [selectedArenaId, setSelectedArenaId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [orders, setOrders]                   = useState<any[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [updating, setUpdating]               = useState<string | null>(null);
  const [error, setError]                     = useState<string | null>(null);
  const [toast, setToast]                     = useState<string | null>(null);

  const selectedClassIdRef = useRef(selectedClassId);
  selectedClassIdRef.current = selectedClassId;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchArenas = useCallback(async () => {
    try {
      const res = await fetch('/api/arenas');
      const data: any[] = await res.json();
      setArenas(data);
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
      console.error('Gate: fetchArenas error', err);
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
      console.error('Gate: fetchOrders error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArenas(); }, [fetchArenas]);

  useEffect(() => {
    if (!selectedClassId) return;
    setLoading(true);
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, [selectedClassId, fetchOrders]);

  const handleArenaSelect = (arenaId: string) => {
    const arena = arenas.find(a => a.id === arenaId);
    setSelectedArenaId(arenaId);
    const firstClass = arena?.classes?.[0];
    if (firstClass) setSelectedClassId(firstClass.id);
    else setSelectedClassId('');
    setOrders([]);
    setLoading(true);
  };

  const updateStatus = async (orderId: string, newStatus: string, riderName: string) => {
    setUpdating(orderId);
    setError(null);
    try {
      const res = await fetch('/api/status-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runningOrderId: orderId,
          status: newStatus,
          reason: `Gate marshal action: ${newStatus.replace(/_/g, ' ')}`,
          changedBy: 'Gate Marshal',
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Update failed');
      }
      showToast(`${riderName} → ${newStatus.replace(/_/g, ' ')}`);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const currentArena = arenas.find(a => a.id === selectedArenaId);
  const gateOrders = orders
    .filter(o => !TERMINAL_STATUSES.has(o.status))
    .sort((a, b) => a.plannedOrderNo - b.plannedOrderNo);
  const atGateRider = gateOrders.find(o => o.status === 'AT_GATE');

  return (
    <div
      className="min-h-screen -m-8 p-6 md:p-8"
      style={{ background: '#0a0f1a', color: '#e2e8f0' }}
    >
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-bold shadow-2xl animate-slide-in-right flex items-center gap-2"
          style={{ background: '#10b981', color: '#fff', border: '1px solid #059669' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="border-b pb-5" style={{ borderColor: '#1e293b' }}>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: '#fff' }}
            >
              GM
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>
              LiveRide
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: '#f1f5f9' }}>
            Gate Marshal
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: '#64748b' }}>
            Check in riders and manage gate flow
          </p>
        </div>

        {/* ── Western Shoppe Banner Ad ────────────────────────────────── */}
        <AdSpace sponsor="western-shoppe" size="leaderboard" />

        {/* ── Error banner ───────────────────────────────────────────── */}
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19H18.93c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Arena selector ─────────────────────────────────────────── */}
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: '#475569' }}
          >
            Select Arena
          </p>
          <div className="flex flex-wrap gap-2">
            {arenas.map(arena => (
              <button
                key={arena.id}
                id={`gate-arena-btn-${arena.id}`}
                onClick={() => handleArenaSelect(arena.id)}
                className="px-4 py-2 rounded-full font-bold text-sm transition-all duration-150 border"
                style={selectedArenaId === arena.id
                  ? { background: '#2563eb', borderColor: '#3b82f6', color: '#fff' }
                  : { background: '#1e293b', borderColor: '#334155', color: '#94a3b8' }
                }
              >
                {arena.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Class selector ─────────────────────────────────────────── */}
        {currentArena?.classes?.length > 1 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>
              Select Class
            </p>
            <div className="flex flex-wrap gap-2">
              {currentArena.classes.map((cls: any) => (
                <button
                  key={cls.id}
                  id={`gate-class-btn-${cls.id}`}
                  onClick={() => { setSelectedClassId(cls.id); setOrders([]); setLoading(true); }}
                  className="px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150"
                  style={selectedClassId === cls.id
                    ? { background: '#1e3a5f', borderColor: '#3b82f6', color: '#60a5fa' }
                    : { background: '#1e293b', borderColor: '#334155', color: '#64748b' }
                  }
                >
                  {cls.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── AT GATE highlight ──────────────────────────────────────── */}
        {atGateRider && (
          <div
            className="p-5 rounded-2xl flex items-center gap-4 animate-glow-live"
            style={{
              background: 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)',
              border: '2px solid #f97316',
              boxShadow: '0 0 24px rgba(249,115,22,0.2)',
            }}
            id="at-gate-indicator"
          >
            <div className="relative shrink-0">
              <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
              <span className="relative w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                At Gate — Ready for Timer
              </p>
              <p className="font-black text-orange-100 text-lg leading-tight">
                {atGateRider.rider.fullName}
              </p>
              <p className="text-orange-300 text-sm font-medium">on {atGateRider.horse.name}</p>
            </div>
          </div>
        )}

        {/* ── Rider list ─────────────────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-12">
            <div
              className="inline-block w-8 h-8 border-4 rounded-full animate-spin mb-3"
              style={{ borderColor: '#334155', borderTopColor: '#3b82f6' }}
            />
            <p className="text-sm font-medium" style={{ color: '#475569' }}>Loading riders…</p>
          </div>
        ) : !selectedClassId ? (
          <div className="text-center py-12 text-sm font-medium" style={{ color: '#475569' }}>
            Select an arena to see riders.
          </div>
        ) : gateOrders.length === 0 ? (
          <div
            className="text-center py-12 rounded-2xl text-sm font-medium"
            style={{ background: '#0f172a', border: '1px dashed #1e293b', color: '#475569' }}
          >
            No riders pending gate action.
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#0f172a', border: '1px solid #1e293b', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
          >
            {/* List header */}
            <div
              className="px-5 py-3 flex justify-between items-center border-b"
              style={{ background: '#1e293b', borderColor: '#334155' }}
            >
              <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: '#94a3b8' }}>
                Upcoming Riders
              </h2>
              <span className="text-xs font-mono font-bold" style={{ color: '#475569' }}>
                {gateOrders.length} pending
              </span>
            </div>

            <div className="divide-y" style={{ borderColor: '#1e293b' }}>
              {gateOrders.map(order => {
                const isUpdating = updating === order.id;
                const isDone = ['SCRATCHED', 'NO_SHOW'].includes(order.status);
                const isAtGate = order.status === 'AT_GATE';
                const isCheckedIn = order.status === 'CHECKED_IN';

                return (
                  <div
                    key={order.id}
                    id={`gate-rider-row-${order.id}`}
                    className="p-5 transition-colors duration-150"
                    style={{
                      background: isAtGate
                        ? 'linear-gradient(135deg, #431407 0%, #3d1405 100%)'
                        : isCheckedIn
                        ? '#0f2038'
                        : isDone
                        ? 'transparent'
                        : '#0f172a',
                      opacity: isDone ? 0.5 : 1,
                    }}
                  >
                    {/* Rider info */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-black text-base" style={{ color: '#f1f5f9' }}>
                          <span className="font-mono text-sm mr-2" style={{ color: '#475569' }}>
                            #{order.plannedOrderNo}
                          </span>
                          {order.rider.fullName}
                        </p>
                        <p className="text-sm font-medium mt-0.5" style={{ color: '#64748b' }}>
                          {order.horse.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                          {order.rider.school.name} · {order.rider.riderNo}
                        </p>
                      </div>
                      <StatusChip status={order.status} />
                    </div>

                    {/* Action buttons — 4 primary actions with icon + label */}
                    {!isDone && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          {
                            label: 'Check In',
                            status: 'CHECKED_IN',
                            disabled: isUpdating || order.status === 'CHECKED_IN',
                            style: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' },
                            hoverStyle: { background: 'rgba(59,130,246,0.25)' },
                          },
                          {
                            label: 'At Gate',
                            status: 'AT_GATE',
                            disabled: isUpdating || order.status === 'AT_GATE',
                            style: { background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c' },
                            hoverStyle: { background: 'rgba(249,115,22,0.25)' },
                          },
                          {
                            label: 'Hold',
                            status: 'HELD',
                            disabled: isUpdating,
                            style: { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' },
                            hoverStyle: { background: 'rgba(245,158,11,0.25)' },
                          },
                          {
                            label: 'Scratch',
                            status: 'SCRATCHED',
                            disabled: isUpdating,
                            style: { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' },
                            hoverStyle: { background: 'rgba(239,68,68,0.2)' },
                          },
                        ].map(({ label, status, disabled, style }) => (
                          <button
                            key={status}
                            disabled={disabled}
                            onClick={() => updateStatus(order.id, status, order.rider.fullName)}
                            id={`gate-action-${order.id}-${status}`}
                            className="py-3 px-2 rounded-xl text-xs font-bold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1 min-h-[52px]"
                            style={disabled ? { ...style, opacity: 0.3 } : style}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No Show — only when still scheduled */}
                    {order.status === 'SCHEDULED' && !isDone && (
                      <button
                        disabled={isUpdating}
                        onClick={() => updateStatus(order.id, 'NO_SHOW', order.rider.fullName)}
                        id={`gate-action-${order.id}-NO_SHOW`}
                        className="mt-2 w-full py-2 rounded-xl text-xs font-bold transition-all duration-150 disabled:opacity-30"
                        style={{
                          background: 'rgba(107,114,128,0.1)',
                          border: '1px solid rgba(107,114,128,0.25)',
                          color: '#9ca3af',
                        }}
                      >
                        Mark No Show
                      </button>
                    )}

                    {isUpdating && (
                      <p className="text-xs mt-2 text-center animate-pulse" style={{ color: '#475569' }}>
                        Saving…
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
