-- ============================================================
-- LiveRide Platform — Demo User Seed Script
-- Run this in the Neon SQL editor AFTER the User table exists
-- (after running: npx prisma migrate deploy on Vercel)
--
-- IMPORTANT: These are DEMO credentials only.
-- Do NOT expose these on public-facing pages.
-- For production, disable via DEMO_SEED_ENABLED env var.
--
-- Demo passwords are the bcrypt hash of: ChangeMe123!
-- Generate your own at: https://bcrypt-generator.com/ (cost 12)
-- ============================================================

-- Clear existing demo users (idempotent reset)
DELETE FROM "User" WHERE email LIKE '%@liveride.demo';

-- ── Admin ────────────────────────────────────────────────────────────────────
INSERT INTO "User" (
  "id", "email", "name", "passwordHash",
  "role", "viewerPackage", "deviceLimit",
  "subscriptionStatus", "subscriptionEndsAt",
  "createdAt", "updatedAt"
) VALUES (
  'demo-admin-001',
  'admin@liveride.demo',
  'Demo Admin',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhgR6w9P5D3QrKj4yzVfLe',
  'ADMIN',
  NULL,
  1,
  'ACTIVE',
  NULL,
  NOW(),
  NOW()
);

-- ── Gate Marshal ─────────────────────────────────────────────────────────────
INSERT INTO "User" (
  "id", "email", "name", "passwordHash",
  "role", "viewerPackage", "deviceLimit",
  "subscriptionStatus", "subscriptionEndsAt",
  "createdAt", "updatedAt"
) VALUES (
  'demo-gate-001',
  'gate@liveride.demo',
  'Demo Gate Marshal',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhgR6w9P5D3QrKj4yzVfLe',
  'GATE_MARSHAL',
  NULL,
  1,
  'ACTIVE',
  NULL,
  NOW(),
  NOW()
);

-- ── Timer ────────────────────────────────────────────────────────────────────
INSERT INTO "User" (
  "id", "email", "name", "passwordHash",
  "role", "viewerPackage", "deviceLimit",
  "subscriptionStatus", "subscriptionEndsAt",
  "createdAt", "updatedAt"
) VALUES (
  'demo-timer-001',
  'timer@liveride.demo',
  'Demo Timer',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhgR6w9P5D3QrKj4yzVfLe',
  'TIMER',
  NULL,
  1,
  'ACTIVE',
  NULL,
  NOW(),
  NOW()
);

-- ── Judge ────────────────────────────────────────────────────────────────────
INSERT INTO "User" (
  "id", "email", "name", "passwordHash",
  "role", "viewerPackage", "deviceLimit",
  "subscriptionStatus", "subscriptionEndsAt",
  "createdAt", "updatedAt"
) VALUES (
  'demo-judge-001',
  'judge@liveride.demo',
  'Demo Judge',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhgR6w9P5D3QrKj4yzVfLe',
  'JUDGE',
  NULL,
  1,
  'ACTIVE',
  NULL,
  NOW(),
  NOW()
);

-- ── Viewer (Standard plan) ────────────────────────────────────────────────────
INSERT INTO "User" (
  "id", "email", "name", "passwordHash",
  "role", "viewerPackage", "deviceLimit",
  "subscriptionStatus", "subscriptionEndsAt",
  "createdAt", "updatedAt"
) VALUES (
  'demo-viewer-001',
  'viewer@liveride.demo',
  'Demo Viewer',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhgR6w9P5D3QrKj4yzVfLe',
  'VIEWER',
  'STANDARD',
  1,
  'ACTIVE',
  NOW() + INTERVAL '12 months',
  NOW(),
  NOW()
);

-- ============================================================
-- Verification query
-- ============================================================
SELECT id, email, name, role, "viewerPackage", "subscriptionStatus"
FROM "User"
WHERE email LIKE '%@liveride.demo'
ORDER BY role;

-- ============================================================
-- Demo credentials (for local development only):
--
-- admin@liveride.demo   / ChangeMe123! / ADMIN
-- gate@liveride.demo    / ChangeMe123! / GATE_MARSHAL
-- timer@liveride.demo   / ChangeMe123! / TIMER
-- judge@liveride.demo   / ChangeMe123! / JUDGE
-- viewer@liveride.demo  / ChangeMe123! / VIEWER / STANDARD
--
-- DO NOT DISPLAY THESE ON ANY PUBLIC-FACING PAGE.
-- ============================================================
