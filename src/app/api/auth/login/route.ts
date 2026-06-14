import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/login
 *
 * Body: { email: string; password: string }
 *
 * Returns:
 *   200 { user: { id, name, email, role, viewerPackage }, redirectTo: string }
 *   401 { error: string }
 *   400 { error: string }
 *   500 { error: string }
 *
 * Sets httpOnly cookie: lr_role (role value), lr_uid (user id)
 *
 * TODO: Replace with full NextAuth / Supabase / Clerk session when ready.
 */

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN:        '/admin',
  ORGANISER:    '/admin',
  GATE_MARSHAL: '/gate',
  TIMER:        '/timer',
  JUDGE:        '/judge',
  VIEWER:       '/',
};

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      );
    }

    // Lookup user
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
      // Generic error to prevent email enumeration
      return NextResponse.json(
        { error: 'Incorrect email or password.' },
        { status: 401 },
      );
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Incorrect email or password.' },
        { status: 401 },
      );
    }

    // Set session cookies (httpOnly, SameSite=Lax)
    const cookieStore = await cookies();
    const cookieOpts = {
      httpOnly:  true,
      sameSite:  'lax' as const,
      path:      '/',
      maxAge:    60 * 60 * 24 * 7, // 7 days
      secure:    process.env.NODE_ENV === 'production',
    };

    cookieStore.set('lr_role', user.role,  cookieOpts);
    cookieStore.set('lr_uid',  user.id,    cookieOpts);
    cookieStore.set('lr_name', user.name,  cookieOpts);

    // Determine redirect target
    const returnTo   = undefined; // Caller passes returnTo via query string
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
      redirectTo: returnTo ?? defaultPath,
    });
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 },
    );
  }
}
