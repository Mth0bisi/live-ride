import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/health
 *
 * Lightweight liveness + readiness check.
 * Returns:
 *   200 { status: "ok", timestamp: ISO, db: "ok" }
 *   503 { status: "degraded", db: "error", error: string }
 *
 * Used by uptime monitors, load balancers, and deploy pipelines.
 * Excluded from middleware auth guards via matcher config.
 */
export async function GET() {
  try {
    // Lightweight DB connectivity check
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status:    'ok',
      timestamp: new Date().toISOString(),
      db:        'ok',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Health check DB error:', message);
    return NextResponse.json(
      {
        status:    'degraded',
        timestamp: new Date().toISOString(),
        db:        'error',
        error:     message,
      },
      { status: 503 },
    );
  }
}
