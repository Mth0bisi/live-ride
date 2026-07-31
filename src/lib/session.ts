/**
 * session.ts — Session / role helpers for LiveRide.
 *
 * Server-side: reads the `lr_role` and `lr_uid` cookies set at login.
 * Client-side: reads `localStorage` mirrors (set at login for legacy helpers).
 *
 * Primary route protection is enforced in src/middleware.ts.
 * `requireServerRole` acts as a second safety net inside server components.
 *
 * Role values: VIEWER | GATE_MARSHAL | TIMER | JUDGE | ORGANISER | ADMIN
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Role } from '@/lib/auth';

export type SessionRole = Role | 'ADMIN' | 'TIMER' | null;

// ─── Allowed roles for each protected area ────────────────────────────────────

export const PROTECTED_AREAS: Record<string, SessionRole[]> = {
  '/admin':          ['ADMIN', 'ORGANISER'],
  '/dashboard':      ['ADMIN', 'ORGANISER'],
  '/events/manage':  ['ADMIN', 'ORGANISER'],
  '/arenas/manage':  ['ADMIN', 'ORGANISER'],
  '/classes/manage': ['ADMIN', 'ORGANISER'],
  '/gate':           ['ADMIN', 'ORGANISER', 'GATE_MARSHAL'],
  '/marshal':        ['ADMIN', 'ORGANISER', 'GATE_MARSHAL'],
  '/check-in':       ['ADMIN', 'ORGANISER', 'GATE_MARSHAL'],
  '/timer':          ['ADMIN', 'ORGANISER', 'TIMER'],
  '/judge':          ['ADMIN', 'ORGANISER', 'JUDGE'],
  '/scoring':        ['ADMIN', 'ORGANISER', 'JUDGE'],
  '/live':           ['ADMIN', 'ORGANISER', 'VIEWER', 'GATE_MARSHAL', 'TIMER', 'JUDGE'],
  '/events':         ['ADMIN', 'ORGANISER', 'VIEWER', 'GATE_MARSHAL', 'TIMER', 'JUDGE'],
  '/results':        ['ADMIN', 'ORGANISER', 'VIEWER', 'GATE_MARSHAL', 'TIMER', 'JUDGE'],
};

// ─── Server-side session helpers ──────────────────────────────────────────────

/**
 * Read the session role from the `lr_role` HTTP cookie (server component only).
 * TODO: Replace with real JWT/session verification.
 */
export async function getServerSessionRole(): Promise<SessionRole> {
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get('lr_role')?.value ?? null;
    return (value as SessionRole) ?? null;
  } catch {
    // cookies() throws outside of request context — safe fallback
    return null;
  }
}

/**
 * Check if the given role has access to a path prefix.
 * Returns true for public routes (/, /login, /signup, /unauthorized).
 */
export function roleCanAccess(role: SessionRole, pathname: string): boolean {
  // Public routes — always allowed
  const publicPaths = ['/', '/login', '/signup', '/unauthorized'];
  if (publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return true;
  }

  // Find the longest matching protected prefix
  const matchKey = Object.keys(PROTECTED_AREAS)
    .filter(k => pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchKey) {
    // Unknown route — allow for now (TODO: restrict in production)
    return true;
  }

  const allowed = PROTECTED_AREAS[matchKey] ?? [];
  return role !== null && allowed.includes(role);
}

/**
 * Server component helper — verifies the session role and redirects if not allowed.
 * Throws a Next.js redirect (never returns null for an unauthorised caller).
 */
export async function requireServerRole(
  allowedRoles: SessionRole[],
): Promise<SessionRole> {
  const role = await getServerSessionRole();
  if (role === null || !allowedRoles.includes(role)) {
    redirect('/unauthorized');
  }
  return role;
}

// ─── Client-side session helpers ─────────────────────────────────────────────

/**
 * Read the role from localStorage (client component safe).
 * Returns null if not in browser context.
 */
export function getClientSessionRole(): SessionRole {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem('lr_role');
    return (value as SessionRole) ?? null;
  } catch {
    return null;
  }
}

/**
 * Mirror the session role in localStorage (called at login for client helpers).
 */
export function setClientSessionRole(role: SessionRole): void {
  if (typeof window === 'undefined') return;
  if (role) {
    localStorage.setItem('lr_role', role);
  } else {
    localStorage.removeItem('lr_role');
  }
}

/**
 * Clear the session (logout).
 */
export function clearClientSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lr_role');
}
