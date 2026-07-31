import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/auth/login
 *
 * Body: { email: string; password: string }
 *
 * Returns:
 *   200 { user: { id, name, email, role, viewerPackage }, redirectTo: string }
 *   400 { error: string }
 *   401 { error: string }
 *   429 { error: string; retryAfterSeconds: number }
 *   500 { error: string }
 *
 * Sets httpOnly cookies: lr_role, lr_uid, lr_name (7-day expiry).
 * Rate limited: 10 attempts per IP per 60 seconds.
 */

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN:        '/admin',
  ORGANISER:    '/admin',
  GATE_MARSHAL: '/gate',
  TIMER:        '/timer',
  JUDGE:        '/judge',
  VIEWER:       '/',
};

export async function POST(request: NextRequest) {
  // ── Rate limiting ────────────────────────────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    null;

  const rateLimit = checkRateLimit(ip);
  if (rateLimit.limited) {
    return NextResponse.json(
      {
        error: `Too many login attempts. Please try again in ${rateLimit.retryAfterSeconds} second${rateLimit.retryAfterSeconds === 1 ? '' : 's'}.`,
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  // ── Request body ─────────────────────────────────────────────────────────────
  try {
    const body = await request.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    // ── DB lookup ─────────────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id:                 true,
        name:               true,
        email:              true,
        role:               true,
        viewerPackage:      true,
        subscriptionStatus: true,
        passwordHash:       true,
      },
    });

    if (!user || !user.passwordHash) {
      // Generic error — prevents email enumeration
      return NextResponse.json(
        { error: 'Incorrect email or password.' },
        { status: 401 },
      );
    }

    // ── Password verification ─────────────────────────────────────────────────
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Incorrect email or password.' },
        { status: 401 },
      );
    }

    // ── Set session cookies (httpOnly, SameSite=Lax) ──────────────────────────
    const cookieStore = await cookies();
    const cookieOpts = {
      httpOnly: true,
      sameSite: 'lax' as const,
      path:     '/',
      maxAge:   60 * 60 * 24 * 7, // 7 days
      secure:   process.env.NODE_ENV === 'production',
    };

    cookieStore.set('lr_role', user.role, cookieOpts);
    cookieStore.set('lr_uid',  user.id,   cookieOpts);
    cookieStore.set('lr_name', user.name, cookieOpts);

    const defaultPath = ROLE_REDIRECT[user.role] ?? '/';

    return NextResponse.json({
      user: {
        id:                 user.id,
        name:               user.name,
        email:              user.email,
        role:               user.role,
        viewerPackage:      user.viewerPackage,
        subscriptionStatus: user.subscriptionStatus,
      },
      redirectTo: defaultPath,
    });
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 },
    );
  }
}
