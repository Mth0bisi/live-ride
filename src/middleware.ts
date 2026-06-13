import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { matcher: '/welcome' };

export async function middleware() {
  const greeting = await get('greeting');
  // NextResponse.json requires Next.js v13.1+ or experimental.allowMiddlewareResponseBody in next.config.js
  return NextResponse.json(greeting);
}
