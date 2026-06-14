-- ============================================================
-- LiveRide Platform — Demo User Seed Script
-- Run this in the Neon SQL editor AFTER the User table exists.
--
-- Password for ALL demo accounts: ChangeMe123!
-- Hash below is bcrypt cost-10 of "ChangeMe123!" (verified correct).
--
-- IMPORTANT: DO NOT expose these credentials on any public page.
-- ============================================================

-- Create table if not yet migrated (safe no-op if already exists)
CREATE TABLE IF NOT EXISTS "User" (
    "id"                 TEXT         NOT NULL,
    "email"              TEXT         NOT NULL,
    "name"               TEXT         NOT NULL,
    "passwordHash"       TEXT,
    "role"               TEXT         NOT NULL DEFAULT 'VIEWER',
    "viewerPackage"      TEXT,
    "deviceLimit"        INTEGER      NOT NULL DEFAULT 1,
    "subscriptionStatus" TEXT         NOT NULL DEFAULT 'INACTIVE',
    "subscriptionEndsAt" TIMESTAMP(3),
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key"              ON "User"("email");
CREATE INDEX        IF NOT EXISTS "User_role_idx"               ON "User"("role");
CREATE INDEX        IF NOT EXISTS "User_subscriptionStatus_idx" ON "User"("subscriptionStatus");

-- ── Upsert demo users (idempotent — safe to re-run) ─────────────────────────
-- bcrypt hash of: ChangeMe123!  (cost factor 10)
-- $2b$10$CyzGL2i/5W7grvXEHyZ1Uu/lUrIeVdg7B6QQLrGGDKK2qk9DyWgYK

INSERT INTO "User" ("id","email","name","passwordHash","role","viewerPackage","deviceLimit","subscriptionStatus","subscriptionEndsAt","createdAt","updatedAt")
VALUES (
  'demo-admin-001',
  'admin@liveride.demo',
  'Demo Admin',
  '$2b$10$CyzGL2i/5W7grvXEHyZ1Uu/lUrIeVdg7B6QQLrGGDKK2qk9DyWgYK',
  'ADMIN', NULL, 1, 'ACTIVE', NULL, NOW(), NOW()
)
ON CONFLICT ("email") DO UPDATE SET
  "passwordHash"       = EXCLUDED."passwordHash",
  "role"               = EXCLUDED."role",
  "subscriptionStatus" = EXCLUDED."subscriptionStatus",
  "updatedAt"          = NOW();

INSERT INTO "User" ("id","email","name","passwordHash","role","viewerPackage","deviceLimit","subscriptionStatus","subscriptionEndsAt","createdAt","updatedAt")
VALUES (
  'demo-gate-001',
  'gate@liveride.demo',
  'Demo Gate Marshal',
  '$2b$10$CyzGL2i/5W7grvXEHyZ1Uu/lUrIeVdg7B6QQLrGGDKK2qk9DyWgYK',
  'GATE_MARSHAL', NULL, 1, 'ACTIVE', NULL, NOW(), NOW()
)
ON CONFLICT ("email") DO UPDATE SET
  "passwordHash"       = EXCLUDED."passwordHash",
  "role"               = EXCLUDED."role",
  "subscriptionStatus" = EXCLUDED."subscriptionStatus",
  "updatedAt"          = NOW();

INSERT INTO "User" ("id","email","name","passwordHash","role","viewerPackage","deviceLimit","subscriptionStatus","subscriptionEndsAt","createdAt","updatedAt")
VALUES (
  'demo-timer-001',
  'timer@liveride.demo',
  'Demo Timer',
  '$2b$10$CyzGL2i/5W7grvXEHyZ1Uu/lUrIeVdg7B6QQLrGGDKK2qk9DyWgYK',
  'TIMER', NULL, 1, 'ACTIVE', NULL, NOW(), NOW()
)
ON CONFLICT ("email") DO UPDATE SET
  "passwordHash"       = EXCLUDED."passwordHash",
  "role"               = EXCLUDED."role",
  "subscriptionStatus" = EXCLUDED."subscriptionStatus",
  "updatedAt"          = NOW();

INSERT INTO "User" ("id","email","name","passwordHash","role","viewerPackage","deviceLimit","subscriptionStatus","subscriptionEndsAt","createdAt","updatedAt")
VALUES (
  'demo-judge-001',
  'judge@liveride.demo',
  'Demo Judge',
  '$2b$10$CyzGL2i/5W7grvXEHyZ1Uu/lUrIeVdg7B6QQLrGGDKK2qk9DyWgYK',
  'JUDGE', NULL, 1, 'ACTIVE', NULL, NOW(), NOW()
)
ON CONFLICT ("email") DO UPDATE SET
  "passwordHash"       = EXCLUDED."passwordHash",
  "role"               = EXCLUDED."role",
  "subscriptionStatus" = EXCLUDED."subscriptionStatus",
  "updatedAt"          = NOW();

INSERT INTO "User" ("id","email","name","passwordHash","role","viewerPackage","deviceLimit","subscriptionStatus","subscriptionEndsAt","createdAt","updatedAt")
VALUES (
  'demo-viewer-001',
  'viewer@liveride.demo',
  'Demo Viewer',
  '$2b$10$CyzGL2i/5W7grvXEHyZ1Uu/lUrIeVdg7B6QQLrGGDKK2qk9DyWgYK',
  'VIEWER', 'STANDARD', 1, 'ACTIVE',
  NOW() + INTERVAL '12 months',
  NOW(), NOW()
)
ON CONFLICT ("email") DO UPDATE SET
  "passwordHash"       = EXCLUDED."passwordHash",
  "role"               = EXCLUDED."role",
  "viewerPackage"      = EXCLUDED."viewerPackage",
  "subscriptionStatus" = EXCLUDED."subscriptionStatus",
  "subscriptionEndsAt" = EXCLUDED."subscriptionEndsAt",
  "updatedAt"          = NOW();

-- ── Verify ───────────────────────────────────────────────────────────────────
SELECT id, email, name, role, "viewerPackage", "subscriptionStatus"
FROM "User"
WHERE email LIKE '%@liveride.demo'
ORDER BY role;

-- ============================================================
-- DEMO CREDENTIALS (local development only — do NOT show on UI):
--
-- admin@liveride.demo   / ChangeMe123!  → ADMIN     → /admin
-- gate@liveride.demo    / ChangeMe123!  → GATE_MARSHAL → /gate
-- timer@liveride.demo   / ChangeMe123!  → TIMER     → /timer
-- judge@liveride.demo   / ChangeMe123!  → JUDGE     → /judge
-- viewer@liveride.demo  / ChangeMe123!  → VIEWER    → /
-- ============================================================
