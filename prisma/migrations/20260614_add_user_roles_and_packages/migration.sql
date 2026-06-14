-- CreateTable: User model with role-based access fields
-- Run this on Neon SQL editor or via: npx prisma migrate deploy (on Vercel)

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

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key"    ON "User"("email");
CREATE INDEX        IF NOT EXISTS "User_role_idx"     ON "User"("role");
CREATE INDEX        IF NOT EXISTS "User_subscriptionStatus_idx" ON "User"("subscriptionStatus");
