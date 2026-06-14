import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/logout
 * Clears the lr_role, lr_uid, lr_name session cookies.
 */
export async function POST() {
  const cookieStore = await cookies();
  const opts = { path: '/', maxAge: 0 };
  cookieStore.set('lr_role', '', opts);
  cookieStore.set('lr_uid',  '', opts);
  cookieStore.set('lr_name', '', opts);
  return NextResponse.json({ ok: true });
}
