/**
 * rate-limit.ts — Lightweight in-memory IP-based rate limiter.
 *
 * Designed for the login endpoint: prevents brute-force credential stuffing.
 *
 * Design:
 *   - Tracks attempt counts per IP in a Map with expiry timestamps.
 *   - Window: 60 seconds, max 10 attempts per window.
 *   - No external dependencies — falls back gracefully if IP is missing.
 *   - Fire-and-forget cleanup (prunes expired entries on each call).
 *
 * Usage:
 *   const { limited, remaining, retryAfterSeconds } = checkRateLimit(ip);
 *   if (limited) return NextResponse.json({ error: '...' }, { status: 429 });
 */

const WINDOW_MS   = 60_000; // 60 seconds
const MAX_ATTEMPTS = 10;

interface WindowEntry {
  count:     number;
  windowEnd: number; // ms since epoch
}

const store = new Map<string, WindowEntry>();

/** Remove entries whose windows have expired. */
function prune(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.windowEnd) store.delete(key);
  }
}

export interface RateLimitResult {
  limited:            boolean;
  remaining:          number;
  retryAfterSeconds:  number;
}

/**
 * Check and increment the rate limit counter for a given IP.
 * Returns whether the request is limited and how many attempts remain.
 */
export function checkRateLimit(ip: string | null | undefined): RateLimitResult {
  // No IP (e.g. local dev without forwarded headers) — allow through
  if (!ip) {
    return { limited: false, remaining: MAX_ATTEMPTS, retryAfterSeconds: 0 };
  }

  prune();

  const now  = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.windowEnd) {
    // New window
    store.set(ip, { count: 1, windowEnd: now + WINDOW_MS });
    return { limited: false, remaining: MAX_ATTEMPTS - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((entry.windowEnd - now) / 1000);
    return { limited: true, remaining: 0, retryAfterSeconds };
  }

  entry.count += 1;
  return { limited: false, remaining: MAX_ATTEMPTS - entry.count, retryAfterSeconds: 0 };
}
