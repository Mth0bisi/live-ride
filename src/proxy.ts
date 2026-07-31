import { NextRequest, NextResponse } from 'next/server';

/**
 * proxy.ts — Role-based route protection for LiveRide (Next.js 16).
 *
 * Protected prefixes and the roles allowed to access them.
 * All other routes are public.
 *
 * Cookie names:
 *   lr_uid  — user id (presence = authenticated)
 *   lr_role — role string (VIEWER | GATE_MARSHAL | TIMER | JUDGE | ADMIN | ORGANISER)
 */

type Role = 'VIEWER' | 'GATE_MARSHAL' | 'TIMER' | 'JUDGE' | 'ADMIN' | 'ORGANISER';

/**
 * Map of protected path prefixes → allowed roles.
 * Longer prefixes are matched first (specificity).
 */
const PROTECTED: Record<string, Role[]> = {
  '/admin':   ['ADMIN', 'ORGANISER'],
  '/gate':    ['GATE_MARSHAL', 'ADMIN', 'ORGANISER'],
  '/timer':   ['TIMER', 'ADMIN', 'ORGANISER'],
  '/judge':   ['JUDGE', 'ADMIN', 'ORGANISER'],
  '/profile': ['VIEWER', 'GATE_MARSHAL', 'TIMER', 'JUDGE', 'ADMIN', 'ORGANISER'],
};

function getProtectedEntry(pathname: string): [string, Role[]] | null {
  // Sort by length descending so /admin/arenas matches /admin before /
  const keys = Object.keys(PROTECTED).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (pathname === key || pathname.startsWith(key + '/')) {
      return [key, PROTECTED[key]];
    }
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const entry = getProtectedEntry(pathname);
  if (!entry) {
    // Public route — allow through
    return NextResponse.next();
  }

  const [, allowedRoles] = entry;

  const uid  = request.cookies.get('lr_uid')?.value;
  const role = request.cookies.get('lr_role')?.value as Role | undefined;

  // Not authenticated → redirect to /login with return URL
  if (!uid) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = `?return=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated but wrong role → /unauthorized
  if (!role || !allowedRoles.includes(role)) {
    const unauthorizedUrl = request.nextUrl.clone();
    unauthorizedUrl.pathname = '/unauthorized';
    unauthorizedUrl.search = '';
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all routes EXCEPT:
   *   - Next.js internals (_next/*)
   *   - Static files (favicon, images, fonts, etc.)
   *   - Public API auth routes (/api/auth/*)
   *   - Health endpoint (/api/health)
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sponsors/|fonts/|api/auth/|api/health).*)',
  ],
};
