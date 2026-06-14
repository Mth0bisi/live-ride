/**
 * session.ts — Placeholder session / role helper for LiveRide.
 *
 * This is a STUB implementation.
 * TODO: Replace with a real auth provider (NextAuth, Supabase Auth, Clerk, etc.)
 * when auth infrastructure is ready.
 *
 * Current behaviour:
 * - Server-side: reads the `lr_role` cookie (set at login)
 * - Client-side: reads `localStorage.getItem('lr_role')` (set at login)
 * - Falls back to null (unauthenticated) if no cookie/storage value found
 *
 * Role values: VIEWER | GATE_MARSHAL | TIMER | JUDGE | ORGANISER | ADMIN
 */

import { cookies } from 'next/headers';
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
 * Server action helper — returns the role or redirects to /unauthorized.
 * TODO: Wire in real redirect when Next.js `redirect()` is appropriate here.
 */
export async function requireServerRole(
  allowedRoles: SessionRole[],
): Promise<SessionRole> {
  const role = await getServerSessionRole();
  if (role === null || !allowedRoles.includes(role)) {
    // TODO: uncomment once real auth is in place:
    // redirect('/unauthorized');
    return null;
  }
  return role;
}

// ─── Client-side session helpers ─────────────────────────────────────────────

/**
 * Read the role from localStorage (client component safe).
 * Returns null if not in browser context.
 * TODO: Replace with real token validation.
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
 * Set the session role in localStorage (called at login).
 * TODO: Replace with real session cookie write.
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
