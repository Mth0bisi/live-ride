'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminArenaDashboard() {
  const { arenaId } = useParams();
  const router = useRouter();
  const [arena, setArena] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  // Modals & User Input State
  const [orderToSwap, setOrderToSwap] = useState<any>(null);
  const [targetOrderNo, setTargetOrderNo] = useState<number | null>(null);
  const [targetRiderName, setTargetRiderName] = useState<string>('');
  const [swapReason, setSwapReason] = useState<string>('');

  const [orderToOverride, setOrderToOverride] = useState<any>(null);
  const [overrideStatus, setOverrideStatus] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Arena & Classes Info
  const fetchArena = async () => {
    try {
      const res = await fetch('/api/arenas');
      const data = await res.json();
      const current = data.find((a: any) => a.id === arenaId);
      setArena(current);
      if (current) {
        setClasses(current.classes);
        if (current.classes.length > 0 && !selectedClassId) {
          // Default to the first ACTIVE class, or the first class
          const activeCls = current.classes.find((c: any) => c.status === 'ACTIVE');
          setSelectedClassId(activeCls ? activeCls.id : current.classes[0].id);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to fetch arena details');
    }
  };

  // Fetch Running Orders for Selected Class
  const fetchOrders = async (background = false) => {
    if (!selectedClassId) return;
    if (!background) setLoading(true);
    else setReloading(true);

    try {
      const res = await fetch(`/api/running-orders?classId=${selectedClassId}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to fetch running orders');
    } finally {
      setLoading(false);
      setReloading(false);
    }
  };

  useEffect(() => {
    fetchArena();
    // Refresh arena info periodically (every 10 seconds)
    const interval = setInterval(() => {
      fetchArena();
    }, 10000);
    return () => clearInterval(interval);
  }, [arenaId]);

  useEffect(() => {
    if (selectedClassId) {
      fetchOrders();
    }
  }, [selectedClassId]);

  // Utility to show temporary success/error messages
  const showToast = (type: 'success' | 'error', msg: string) => {
    if (type === 'success') {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Handle Arena Status Change
  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch('/api/arenas/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arenaId, status: newStatus })
      });
      if (res.ok) {
        showToast('success', `Arena status set to ${newStatus.replace(/_/g, ' ')}`);
        fetchArena();
      } else {
        showToast('error', 'Failed to update arena status');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Network error changing arena status');
    }
  };

  // Handle Class Status Change
  const handleClassStatusChange = async (classId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, status: newStatus })
      });
      if (res.ok) {
        showToast('success', `Class status updated to ${newStatus}`);
        fetchArena();
        fetchOrders(true);
      } else {
        showToast('error', 'Failed to update class status');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Network error changing class status');
    }
  };

  // Handle Moving a Rider Up or Down
  const handleMoveRider = (order: any, direction: 'UP' | 'DOWN') => {
    const currentIndex = orders.findIndex(o => o.id === order.id);
    if (direction === 'UP' && currentIndex === 0) return;
    if (direction === 'DOWN' && currentIndex === orders.length - 1) return;

    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    const target = orders[targetIndex];

    setOrderToSwap(order);
    setTargetOrderNo(target.plannedOrderNo);
    setTargetRiderName(target.rider.fullName);
    setSwapReason(`Clash in schedule, swapping with ${target.rider.fullName}`);
  };

  // Submit Order Swap / Change
  const submitOrderChange = async () => {
    if (!targetOrderNo || !swapReason.trim()) {
      showToast('error', 'Reason for running order swap is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/running-orders/change-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runningOrderId: orderToSwap.id,
          newPlannedOrderNo: targetOrderNo,
          reason: swapReason,
          changedBy: 'Arena Control (Admin)'
        })
      });

      if (res.ok) {
        showToast('success', 'Rider order swapped successfully');
        setOrderToSwap(null);
        setTargetOrderNo(null);
        setTargetRiderName('');
        setSwapReason('');
        fetchOrders(true);
      } else {
        const errorData = await res.json();
        showToast('error', errorData.error || 'Failed to change order');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Network error swapping order positions');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Status Override Initiator
  const handleInitiateOverride = (order: any) => {
    setOrderToOverride(order);
    setOverrideStatus(order.status);
    setOverrideReason('');
  };

  // Submit Status Override
  const submitStatusOverride = async () => {
    if (!overrideStatus) {
      showToast('error', 'Please select a new status');
      return;
    }
    if (!overrideReason.trim()) {
      showToast('error', 'Reason for status override is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/status-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runningOrderId: orderToOverride.id,
          status: overrideStatus,
          reason: overrideReason,
          changedBy: 'Arena Control (Manual Override)'
        })
      });

      if (res.ok) {
        showToast('success', `Rider status overridden to ${overrideStatus}`);
        setOrderToOverride(null);
        setOverrideStatus('');
        setOverrideReason('');
        fetchOrders(true);
      } else {
        const errorData = await res.json();
        showToast('error', errorData.error || 'Failed to override rider status');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Network error overriding rider status');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !arena) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-semibold tracking-wider animate-pulse">BOOTING CONTROL ROOM PANEL...</p>
      </div>
    );
  }

  // Segmenting Riders based on status
  const currentRider = orders.find(o => o.status === 'IN_ARENA') || null;

  const upcomingRiders = orders
    .filter(o => ['SCHEDULED', 'CHECKED_IN', 'AT_GATE'].includes(o.status))
    .sort((a, b) => a.plannedOrderNo - b.plannedOrderNo)
    .slice(0, 5);

  const completedRiders = orders
    .filter(o => ['FINISHED', 'RESULT_PENDING', 'RESULT_CONFIRMED', 'PUBLISHED', 'ELIMINATED', 'RETIRED'].includes(o.status))
    .sort((a, b) => (b.finishedAt ? new Date(b.finishedAt).getTime() : 0) - (a.finishedAt ? new Date(a.finishedAt).getTime() : 0));

  const heldOrScratchedRiders = orders
    .filter(o => ['HELD', 'SCRATCHED', 'NO_SHOW'].includes(o.status))
    .sort((a, b) => a.plannedOrderNo - b.plannedOrderNo);

  // Extract recent status change history for selected class
  const allLogs = orders
    .flatMap((o: any) =>
      o.statusHistory.map((h: any) => ({
        ...h,
        riderName: o.rider.fullName,
        riderNo: o.rider.riderNo,
        horseName: o.horse.name,
        plannedOrderNo: o.plannedOrderNo
      }))
    )
    .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
    .slice(0, 15);

  const arenaStatuses = ['ACTIVE', 'PAUSED', 'ARENA_RAKE', 'COURSE_CHANGE', 'COMPLETE'];
  const activeClass = classes.find(c => c.id === selectedClassId) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans antialiased">
      {/* Toast Notification Banner */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/90 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-green-400 flex items-center gap-3 animate-bounce">
          <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-bold tracking-wide">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 bg-red-500/90 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-red-400 flex items-center gap-3 animate-pulse">
          <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-bold tracking-wide">{errorMessage}</span>
        </div>
      )}

      {/* Control Room Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link href={`/admin/event/${arena.eventId}`} className="text-slate-400 hover:text-blue-400 transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              &larr; Return to Dashboard
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">Live Arena Control</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white">{arena.name}</h1>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase">LIVE SYSTEM ACTIVE</span>
          </div>
        </div>

        {/* System Telemetry Clock */}
        <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-right">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Local Arena Time</p>
            <p className="text-sm font-mono font-bold text-slate-200">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <button
            onClick={() => fetchOrders(true)}
            disabled={reloading}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-40"
            title="Force telemetry refresh"
          >
            <svg className={`w-5 h-5 ${reloading ? 'animate-spin text-blue-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Arena Status & Class Flow Control (4 cols) */}
        <section className="lg:col-span-4 space-y-6">
          
          {/* Arena Status Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl"></div>
            
            <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Arena System Flow
            </h2>

            <div className="flex items-center justify-between mb-5 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Active Status</p>
                <p className="text-lg font-black tracking-tight text-white">{arena.status.replace(/_/g, ' ')}</p>
              </div>
              <span className={`h-3 w-3 rounded-full animate-pulse shadow-[0_0_12px] ${
                arena.status === 'ACTIVE' ? 'bg-emerald-500 text-emerald-500 shadow-emerald-500' :
                arena.status === 'PAUSED' ? 'bg-amber-500 text-amber-500 shadow-amber-500' :
                ['ARENA_RAKE', 'COURSE_CHANGE'].includes(arena.status) ? 'bg-orange-500 text-orange-500 shadow-orange-500 animate-ping' :
                'bg-slate-500 text-slate-500 shadow-slate-500'
              }`}></span>
            </div>

            {/* Arena Flow Warning Banner */}
            {['ARENA_RAKE', 'COURSE_CHANGE'].includes(arena.status) && (
              <div className="mb-5 bg-orange-950/50 border border-orange-500/30 rounded-xl p-3 text-orange-200 text-xs leading-relaxed flex gap-2.5 items-start animate-pulse">
                <svg className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <strong className="block text-orange-300 font-bold uppercase tracking-wider mb-0.5">Rider Flow Paused</strong>
                  The arena is currently undergoinig maintenance ({arena.status.replace(/_/g, ' ')}). Please hold upcoming riders at the gate.
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Set Arena State</p>
              <div className="grid grid-cols-2 gap-2">
                {arenaStatuses.map(s => {
                  const isActive = arena.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 ${
                        isActive
                          ? s === 'ACTIVE' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-black shadow-[0_0_10px_rgba(16,185,129,0.15)]' :
                            s === 'PAUSED' ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-black' :
                            ['ARENA_RAKE', 'COURSE_CHANGE'].includes(s) ? 'bg-orange-500/20 border-orange-500 text-orange-400 font-black' :
                            'bg-violet-500/20 border-violet-500 text-violet-400 font-black'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      {s === 'ACTIVE' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>}
                      {s === 'PAUSED' && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0"></span>}
                      {['ARENA_RAKE', 'COURSE_CHANGE'].includes(s) && <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0"></span>}
                      {s.replace(/_/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Classes Flow Control Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
            <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Competition Classes
            </h2>

            <div className="space-y-3">
              {classes.map(cls => {
                const isSelected = selectedClassId === cls.id;
                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.1)]'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-blue-500 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-bl uppercase">
                        Current Management Focus
                      </div>
                    )}
                    
                    <div className="mb-2.5">
                      <p className="text-sm font-black text-slate-200 tracking-tight">{cls.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">{cls.height} | {cls.competitionType}</p>
                    </div>

                    <div className="flex justify-between items-center mt-1 border-t border-slate-800/80 pt-2.5">
                      <div className="flex gap-1.5 items-center">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          cls.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          cls.status === 'COMPLETE' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {cls.status}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">#{cls.classCode}</span>
                      </div>

                      {/* Switch Class State Buttons (Direct controls) */}
                      {isSelected && (
                        <div className="flex gap-1">
                          {cls.status !== 'ACTIVE' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClassStatusChange(cls.id, 'ACTIVE');
                              }}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-all"
                            >
                              Activate
                            </button>
                          )}
                          {cls.status !== 'COMPLETE' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClassStatusChange(cls.id, 'COMPLETE');
                              }}
                              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold transition-all"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MIDDLE COLUMN: Current Rider & Upcoming Queue Control (5 cols) */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* CURRENT RIDER PANEL */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl"></div>

            <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Arena Floor - Current Round
            </h2>

            {currentRider ? (
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-500/20 uppercase">
                      IN ARENA — Round Active
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-white mt-2.5">{currentRider.rider.fullName}</h3>
                    <p className="text-xs text-slate-400 font-semibold tracking-wide mt-1">Horse: <span className="text-slate-200">{currentRider.horse.name}</span></p>
                    <p className="text-xs text-slate-500 mt-0.5">School: <span className="text-slate-400">{currentRider.rider.school.name}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Draw No</p>
                    <p className="text-3xl font-mono font-black text-slate-200">#{currentRider.plannedOrderNo}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 border-t border-slate-900 pt-4 mt-2">
                  <button
                    onClick={() => handleInitiateOverride(currentRider)}
                    className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Override Status
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 border border-slate-900 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-slate-500 mb-3 border border-slate-800">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-slate-300 font-bold text-sm tracking-wide">NO ACTIVE RIDER IN ARENA</p>
                <p className="text-slate-500 text-xs mt-1 max-w-xs leading-normal">
                  Rider flow is currently quiet. Instruct the gate marshal to check in next competitors.
                </p>
                {upcomingRiders.length > 0 && (
                  <button
                    onClick={() => {
                      const next = upcomingRiders[0];
                      setOrderToOverride(next);
                      setOverrideStatus('IN_ARENA');
                      setOverrideReason('Sent to arena by control room');
                    }}
                    className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-950 flex items-center gap-1"
                  >
                    Marshal Rider #{upcomingRiders[0].plannedOrderNo}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* UPCOMING QUEUE PANEL */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Immediate Queue (Next 5)
              </h2>
              <span className="text-[10px] text-slate-500 font-mono font-semibold">Total Remaining: {orders.filter(o => ['SCHEDULED', 'CHECKED_IN', 'AT_GATE'].includes(o.status)).length}</span>
            </div>

            {upcomingRiders.length > 0 ? (
              <div className="space-y-2.5">
                {upcomingRiders.map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className="bg-slate-950/80 border border-slate-900 rounded-xl p-3.5 hover:border-slate-800 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-900 border border-slate-800 h-9 w-9 rounded-lg flex items-center justify-center font-mono font-black text-slate-300 shrink-0 text-sm">
                          #{item.plannedOrderNo}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-200 tracking-tight leading-none">{item.rider.fullName}</p>
                          <p className="text-[10px] text-slate-500 mt-1 font-semibold">{item.horse.name} | {item.rider.school.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Status badge */}
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wide ${
                          item.status === 'AT_GATE' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 animate-pulse' :
                          item.status === 'CHECKED_IN' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                          'bg-slate-800 text-slate-500'
                        }`}>
                          {item.status.replace(/_/g, ' ')}
                        </span>

                        {/* Reordering and override actions */}
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                          <button
                            onClick={() => handleMoveRider(item, 'UP')}
                            disabled={index === 0 && item.plannedOrderNo === orders[0].plannedOrderNo}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Draw Up"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleMoveRider(item, 'DOWN')}
                            disabled={index === upcomingRiders.length - 1 && item.plannedOrderNo === orders[orders.length - 1].plannedOrderNo}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Draw Down"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className="w-px h-4 bg-slate-800 mx-0.5"></div>
                          <button
                            onClick={() => handleInitiateOverride(item)}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded"
                            title="Override Status"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-950/40 rounded-xl p-6 text-center text-slate-500 text-xs">
                No active riders currently scheduled or checked in.
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Held/Scratched, Audit log, Completed (3 cols) */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Held, Scratched, No Show Panel */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
            <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Held / Scratched / No Show
            </h2>

            {heldOrScratchedRiders.length > 0 ? (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {heldOrScratchedRiders.map(item => (
                  <div key={item.id} className="bg-slate-950/60 border border-slate-900 rounded-xl p-3 flex justify-between items-center gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-400">#{item.plannedOrderNo}</span>
                        <p className="text-xs font-black text-slate-200 truncate max-w-[120px]">{item.rider.fullName}</p>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">{item.horse.name}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                        item.status === 'HELD' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.status}
                      </span>
                      <button
                        onClick={() => handleInitiateOverride(item)}
                        className="p-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Reinstate or Override status"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950/40 rounded-xl p-4 text-center text-slate-600 text-xs">
                Zero held or scratched entries.
              </div>
            )}
          </div>

          {/* Completed Rounds Panel */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed Rounds
              </h2>
              <span className="text-[10px] text-slate-500 font-mono font-semibold">Count: {completedRiders.length}</span>
            </div>

            {completedRiders.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {completedRiders.map(item => {
                  const hasResult = item.result !== null;
                  return (
                    <div key={item.id} className="bg-slate-950/60 border border-slate-900 rounded-xl p-3 flex justify-between items-center gap-2 hover:border-slate-800 transition-all">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-slate-400">#{item.plannedOrderNo}</span>
                          <p className="text-xs font-black text-slate-200 truncate max-w-[120px]">{item.rider.fullName}</p>
                        </div>
                        {hasResult ? (
                          <p className="text-[9px] font-mono text-emerald-400 mt-1">
                            Time: {item.result.elapsedSeconds?.toFixed(2)}s | Faults: {item.result.faults ?? 0}
                          </p>
                        ) : (
                          <p className="text-[9px] font-mono text-slate-500 mt-1">No timer record captured</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                          ['FINISHED', 'PUBLISHED', 'RESULT_CONFIRMED'].includes(item.status) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                          item.status === 'RESULT_PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                        }`}>
                          {item.status.replace(/RESULT_/g, '')}
                        </span>
                        <button
                          onClick={() => handleInitiateOverride(item)}
                          className="p-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                          title="Override status"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-950/40 rounded-xl p-4 text-center text-slate-600 text-xs">
                Zero completed rounds in class.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* FULL WIDTH LOWER STRIP: Audit Log Feed */}
      <section className="mt-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
        <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Arena Control Room Live Audit Log Feed
        </h2>

        {allLogs.length > 0 ? (
          <div className="bg-slate-950/80 rounded-xl border border-slate-900 max-h-[250px] overflow-y-auto divide-y divide-slate-900 font-mono text-[11px]">
            {allLogs.map((log: any) => {
              return (
                <div key={log.id} className="p-3 hover:bg-slate-900/40 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-slate-500 font-medium">
                      {new Date(log.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="text-slate-700">|</span>
                    <span className="text-indigo-400 font-bold">Rider #{log.plannedOrderNo} ({log.riderName})</span>
                    <span className="text-slate-600">&rarr;</span>
                    <span className="text-slate-400">
                      Status: <strong className="text-slate-300 font-bold">{log.oldStatus || 'NONE'}</strong> &rarr; <strong className="text-blue-400 font-bold">{log.newStatus}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-slate-400 italic">"{log.reason || 'No reason listed'}"</span>
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-500 rounded uppercase">
                      By: {log.changedBy || 'System'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-950/40 rounded-xl p-6 text-center text-slate-600 text-xs">
            No status log events registered yet for riders in this class.
          </div>
        )}
      </section>

      {/* MODAL 1: ORDER REORDER SWAP MODAL */}
      {orderToSwap && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-white">Running Order Reassignment</h3>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-normal bg-slate-950 border border-slate-800 p-3 rounded-xl">
              You are reassigning <strong className="text-white">{orderToSwap.rider.fullName}</strong> from slot <strong className="text-blue-400">#{orderToSwap.plannedOrderNo}</strong> to slot <strong className="text-blue-400">#{targetOrderNo}</strong>.
              <br />
              <span className="block mt-2 text-amber-400">
                ⚠️ This slot is currently occupied by <strong className="text-white">{targetRiderName}</strong>. Swapping positions will occur automatically.
              </span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Draw Position</label>
                <input
                  type="number"
                  value={targetOrderNo || ''}
                  onChange={(e) => setTargetOrderNo(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-white outline-none font-mono font-bold"
                  placeholder="e.g. 5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reason for Position Change (Required)</label>
                <textarea
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-white outline-none text-xs"
                  placeholder="Provide brief explanation for order changes..."
                  rows={3}
                />
                
                {/* Reason Quick Buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Scheduling clash', 'Marshal request', 'Rider delay', 'Tack adjustment'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSwapReason(t)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-slate-200 rounded font-semibold transition-all"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => {
                  setOrderToSwap(null);
                  setTargetOrderNo(null);
                  setTargetRiderName('');
                  setSwapReason('');
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-slate-400 hover:text-white font-bold rounded-xl text-xs"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={submitOrderChange}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-950/50 flex items-center gap-1.5 transition-all disabled:opacity-40"
              >
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Confirm Swapped Positions'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: STATUS OVERRIDE MODAL */}
      {orderToOverride && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-white">Manual Status Override</h3>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs leading-normal mb-4">
              Rider: <strong className="text-white">{orderToOverride.rider.fullName}</strong>
              <br />
              Current State: <strong className="text-blue-400 font-bold">{orderToOverride.status}</strong>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Arena Status</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-white outline-none text-xs font-bold"
                >
                  <option value="">-- SELECT TARGET STATE --</option>
                  <option value="SCHEDULED">SCHEDULED (Upcoming)</option>
                  <option value="CHECKED_IN">CHECKED_IN (At Arena)</option>
                  <option value="AT_GATE">AT_GATE (Ready at entrance)</option>
                  <option value="IN_ARENA">IN_ARENA (Active round)</option>
                  <option value="FINISHED">FINISHED (Round complete)</option>
                  <option value="HELD">HELD (Temporarily paused)</option>
                  <option value="SCRATCHED">SCRATCHED (Withdrawn)</option>
                  <option value="NO_SHOW">NO_SHOW (Missed class)</option>
                  <option value="ELIMINATED">ELIMINATED (DQ/Disqualified)</option>
                  <option value="RETIRED">RETIRED (Opted out mid-ride)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reason for Status Override (Required)</label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-white outline-none text-xs"
                  placeholder="Provide audit trail explanation for manual state override..."
                  rows={3}
                />
                
                {/* Reason Quick Buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Rider request', 'Missed draw slot', 'Ground fall/Eliminated', 'Lame horse', 'Marshal override'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOverrideReason(t)}
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-slate-200 rounded font-semibold transition-all"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => {
                  setOrderToOverride(null);
                  setOverrideStatus('');
                  setOverrideReason('');
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-slate-400 hover:text-white font-bold rounded-xl text-xs"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={submitStatusOverride}
                disabled={isSubmitting}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-xs shadow-md shadow-violet-950/50 flex items-center gap-1.5 transition-all disabled:opacity-40"
              >
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Commit State Override'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
