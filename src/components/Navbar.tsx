'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarProps {
  initialUid: string | null;
  initialRole: string | null;
  initialName: string | null;
}

export default function Navbar({ initialUid, initialRole, initialName }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isLoggedIn = !!initialUid;
  const role = initialRole;
  const name = initialName;

  // Handlers
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (res.ok) {
        localStorage.removeItem('lr_role');
        // Force full refresh to clear server cookies and reset page states
        window.location.href = '/';
      } else {
        console.error('Logout failed');
        setIsLoggingOut(false);
      }
    } catch (err) {
      console.error('Logout error', err);
      setIsLoggingOut(false);
    }
  };

  // Nav rules:
  // - Show Events if logged out OR role is VIEWER or ADMIN/ORGANISER
  const showEvents = !isLoggedIn || role === 'VIEWER' || role === 'ADMIN' || role === 'ORGANISER';

  // - Staff shortcuts
  const isGateMarshal = role === 'GATE_MARSHAL';
  const isTimer = role === 'TIMER';
  const isJudge = role === 'JUDGE';
  const isAdminOrOrganiser = role === 'ADMIN' || role === 'ORGANISER';

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
      isActive
        ? 'text-white bg-slate-800'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Logo */}
      <Link
        href="/"
        className="font-black text-xl tracking-tight flex items-center gap-2.5 group"
        aria-label="LiveRide – Home"
      >
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white transition-all duration-200 group-hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
        >
          LR
        </span>
        <span>
          Live<span className="text-blue-400">Ride</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center gap-1.5" role="navigation" aria-label="Main navigation">
        {showEvents && (
          <Link href="/" id="nav-events" className={getNavLinkClass('/')}>
            Events
          </Link>
        )}

        {/* Staff Dashboard Shortcuts */}
        {isLoggedIn && (
          <>
            {isGateMarshal && (
              <Link href="/gate" id="nav-gate-dashboard" className={getNavLinkClass('/gate')}>
                Marshal Dashboard
              </Link>
            )}
            {isTimer && (
              <Link href="/timer" id="nav-timer-dashboard" className={getNavLinkClass('/timer')}>
                Timer Dashboard
              </Link>
            )}
            {isJudge && (
              <Link href="/judge" id="nav-judge-dashboard" className={getNavLinkClass('/judge')}>
                Judge Dashboard
              </Link>
            )}
            {isAdminOrOrganiser && (
              <Link href="/admin" id="nav-admin-dashboard" className={getNavLinkClass('/admin')}>
                Admin Panel
              </Link>
            )}
          </>
        )}

        {/* Auth / Profile Links */}
        <div className="ml-2 flex items-center gap-1.5 border-l border-slate-700 pl-3">
          {isLoggedIn ? (
            <>
              {/* Profile Link with User Icon or Initials */}
              <Link
                href="/profile"
                id="nav-profile"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  pathname === '/profile'
                    ? 'text-white bg-slate-800'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title="View user profile"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase select-none">
                  {name ? name.substring(0, 2) : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{name || 'Profile'}</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                id="nav-logout"
                disabled={isLoggingOut}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                id="nav-login"
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-150"
              >
                Login
              </Link>
              <Link
                href="/signup"
                id="nav-signup"
                className="px-3.5 py-1.5 rounded-lg text-sm font-bold text-white transition-all duration-150"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
