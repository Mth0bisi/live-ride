/**
 * cache.ts — Lightweight cache helper for LiveRide read-heavy public data.
 *
 * Priority:
 *   1. Upstash Redis (KV_REST_API_URL + KV_REST_API_TOKEN env vars)
 *   2. Standard Redis (REDIS_URL env var) — uses dynamic ioredis import
 *   3. In-memory Map fallback (no dependencies required)
 *
 * Usage:
 *   const data = await getOrSetCache('active-events', 60, () => fetchFromDB());
 *
 * Recommended TTLs:
 *   - Active events list:    60 seconds
 *   - Event live summary:     3 seconds
 *   - Public results:         5 seconds
 *   - Event schedule/classes: 60 seconds
 *
 * Cache invalidation:
 *   Call invalidateCache(key) after mutations (result publish, etc.)
 *   TODO: Wire invalidation calls into API mutation routes.
 */

// ─── In-memory fallback ───────────────────────────────────────────────────────

interface MemEntry {
  value: string;
  expiresAt: number; // ms since epoch
}

const memCache = new Map<string, MemEntry>();

function memGet(key: string): string | null {
  const entry = memCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memCache.delete(key);
    return null;
  }
  return entry.value;
}

function memSet(key: string, value: string, ttlSeconds: number): void {
  memCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

// ─── Upstash Redis adapter ────────────────────────────────────────────────────

async function upstashGet(key: string): Promise<string | null> {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json() as { result: string | null };
    return json.result;
  } catch {
    return null;
  }
}

async function upstashSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return;
  try {
    await fetch(`${url}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value, ex: ttlSeconds }),
      cache: 'no-store',
    });
  } catch {
    // Silent failure — cache is best-effort
  }
}

async function upstashDel(key: string): Promise<void> {
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return;
  try {
    await fetch(`${url}/del/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
  } catch { /* silent */ }
}

// ─── Detect which backend to use ─────────────────────────────────────────────

function useUpstash(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// TODO: Add ioredis (standard Redis) support here when REDIS_URL is configured:
// function useRedis(): boolean { return !!process.env.REDIS_URL; }

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Read a value from cache. Returns parsed value or null on miss.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  let raw: string | null = null;

  if (useUpstash()) {
    raw = await upstashGet(key);
  } else {
    raw = memGet(key);
  }

  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Write a value to cache with TTL in seconds.
 */
export async function setCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const serialised = JSON.stringify(value);
  if (useUpstash()) {
    await upstashSet(key, serialised, ttlSeconds);
  } else {
    memSet(key, serialised, ttlSeconds);
  }
}

/**
 * Read-or-fetch pattern. If the key exists in cache, return it.
 * Otherwise call fetcher(), store the result, and return it.
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  // Fire-and-forget cache write — don't block the response
  setCache(key, fresh, ttlSeconds).catch(() => { /* silent */ });
  return fresh;
}

/**
 * Invalidate (delete) a cache key.
 * Call this after mutations that affect the cached data.
 */
export async function invalidateCache(key: string): Promise<void> {
  if (useUpstash()) {
    await upstashDel(key);
  } else {
    memCache.delete(key);
  }
}

/**
 * Invalidate multiple keys at once.
 */
export async function invalidateCacheKeys(keys: string[]): Promise<void> {
  await Promise.all(keys.map(invalidateCache));
}

// ─── Named cache key constants ────────────────────────────────────────────────

export const CacheKeys = {
  activeEvents:              () => 'events:active',
  allEvents:                 () => 'events:all',
  eventLiveSummary:  (id: string) => `event:${id}:live`,
  eventSchedule:     (id: string) => `event:${id}:schedule`,
  publicResults:  (classId: string) => `results:public:${classId}`,
  runningOrder:   (classId: string) => `running-order:${classId}`,
  arenaClasses:  (eventId: string) => `arena-classes:${eventId}`,
} as const;

export const CacheTTL = {
  activeEvents:    60,
  allEvents:       60,
  eventLiveSummary: 3,
  publicResults:    5,
  eventSchedule:   60,
  runningOrder:     3,
  arenaClasses:    60,
} as const;
