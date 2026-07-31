'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  initialUid:  string | null;
  initialRole: string | null;
  initialName: string | null;
}

export default function Navbar({ initialUid, initialRole, initialName }: NavbarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);

  const isLoggedIn       = !!initialUid;
  const role             = initialRole;
  const name             = initialName;
  const isGateMarshal    = role === 'GATE_MARSHAL';
  const isTimer          = role === 'TIMER';
  const isJudge          = role === 'JUDGE';
  const isAdminOrOrg     = role === 'ADMIN' || role === 'ORGANISER';

  // Events tab: show for guests, viewers, and admins
  const showEvents = !isLoggedIn || role === 'VIEWER' || role === 'ADMIN' || role === 'ORGANISER';

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        localStorage.removeItem('lr_role');
        localStorage.removeItem('lr_name');
        window.location.href = '/';
      } else {
        setIsLoggingOut(false);
      }
    } catch {
      setIsLoggingOut(false);
    }
  };

  const linkClass = (href: string) => {
    const active = pathname === href;
    return `px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
      active
        ? 'text-white bg-slate-800'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;
  };

  // Shared nav items rendered both in desktop row and mobile drawer
  const NavLinks = () => (
    <>
      {showEvents && (
        <Link href="/" id="nav-events" className={linkClass('/')} onClick={() => setMenuOpen(false)}>
          Events
        </Link>
      )}
      {isLoggedIn && (
        <>
          {isGateMarshal && (
            <Link href="/gate" id="nav-gate-dashboard" className={linkClass('/gate')} onClick={() => setMenuOpen(false)}>
              Marshal Dashboard
            </Link>
          )}
          {isTimer && (
            <Link href="/timer" id="nav-timer-dashboard" className={linkClass('/timer')} onClick={() => setMenuOpen(false)}>
              Timer Dashboard
            </Link>
          )}
          {isJudge && (
            <Link href="/judge" id="nav-judge-dashboard" className={linkClass('/judge')} onClick={() => setMenuOpen(false)}>
              Judge Dashboard
            </Link>
          )}
          {isAdminOrOrg && (
            <Link href="/admin" id="nav-admin-dashboard" className={linkClass('/admin')} onClick={() => setMenuOpen(false)}>
              Admin Panel
            </Link>
          )}
        </>
      )}
    </>
  );

  const AuthLinks = () => (
    isLoggedIn ? (
      <>
        <Link
          href="/profile"
          id="nav-profile"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
            pathname === '/profile'
              ? 'text-white bg-slate-800'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="View user profile"
          onClick={() => setMenuOpen(false)}
        >
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase select-none">
            {name ? name.substring(0, 2) : 'U'}
          </div>
          <span className="hidden sm:inline max-w-[100px] truncate">{name || 'Profile'}</span>
        </Link>
        <button
          onClick={handleLogout}
          id="nav-logout"
          disabled={isLoggingOut}
          className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 disabled:opacity-50"
        >
          {isLoggingOut ? 'Logging out…' : 'Logout'}
        </button>
      </>
    ) : (
      <>
        <Link
          href="/login"
          id="nav-login"
          className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-150"
          onClick={() => setMenuOpen(false)}
        >
          Login
        </Link>
        <Link
          href="/signup"
          id="nav-signup"
          className="px-3.5 py-1.5 rounded-lg text-sm font-bold text-white transition-all duration-150"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
          onClick={() => setMenuOpen(false)}
        >
          Sign up
        </Link>
      </>
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Desktop row ─────────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center justify-between">
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

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden sm:flex items-center gap-1.5" role="navigation" aria-label="Main navigation">
          <NavLinks />
          <div className="ml-2 flex items-center gap-1.5 border-l border-slate-700 pl-3">
            <AuthLinks />
          </div>
        </nav>

        {/* Hamburger button — visible on mobile only */}
        <button
          id="nav-hamburger"
          onClick={() => setMenuOpen(prev => !prev)}
          className="sm:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-150"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            /* X icon */
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile drawer ───────────────────────────────────────────────────── */}
      {menuOpen && (
        <nav
          id="nav-mobile-menu"
          className="sm:hidden pb-4 flex flex-col gap-1 border-t border-slate-700/60 pt-3 animate-fade-in-up"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <NavLinks />
          <div className="mt-2 pt-3 border-t border-slate-700/60 flex flex-col gap-1">
            <AuthLinks />
          </div>
        </nav>
      )}
    </div>
  );
}
