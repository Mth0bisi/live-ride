warn The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7. Please migrate to a Prisma config file (e.g., `prisma.config.ts`).
For more information, see: https://pris.ly/prisma-config

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "qualifier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arena" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionClass" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "arenaId" TEXT NOT NULL,
    "classCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discipline" TEXT NOT NULL DEFAULT 'SHOWJUMPING',
    "height" TEXT NOT NULL,
    "competitionType" TEXT NOT NULL,
    "feiArticle" TEXT,
    "scheduledStartTime" TEXT NOT NULL,
    "expectedRiders" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitionClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rider" (
    "id" TEXT NOT NULL,
    "riderNo" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'HORSE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunningOrder" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "horseId" TEXT NOT NULL,
    "plannedOrderNo" INTEGER NOT NULL,
    "actualOrderNo" INTEGER,
    "plannedTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "orderChanged" BOOLEAN NOT NULL DEFAULT false,
    "orderChangeReason" TEXT,
    "notes" TEXT,
    "checkedInAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RunningOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "runningOrderId" TEXT NOT NULL,
    "elapsedSeconds" DOUBLE PRECISION,
    "faults" INTEGER,
    "penalties" INTEGER,
    "placing" INTEGER,
    "resultStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "runningOrderId" TEXT NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT NOT NULL,
    "reason" TEXT,
    "changedBy" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimerEvent" (
    "id" TEXT NOT NULL,
    "runningOrderId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "capturedBy" TEXT,

    CONSTRAINT "TimerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    "viewerPackage" TEXT,
    "deviceLimit" INTEGER NOT NULL DEFAULT 1,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'INACTIVE',
    "subscriptionEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Arena_eventId_idx" ON "Arena"("eventId");

-- CreateIndex
CREATE INDEX "Arena_status_idx" ON "Arena"("status");

-- CreateIndex
CREATE INDEX "CompetitionClass_arenaId_idx" ON "CompetitionClass"("arenaId");

-- CreateIndex
CREATE INDEX "CompetitionClass_eventId_idx" ON "CompetitionClass"("eventId");

-- CreateIndex
CREATE INDEX "CompetitionClass_status_idx" ON "CompetitionClass"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionClass_eventId_classCode_key" ON "CompetitionClass"("eventId", "classCode");

-- CreateIndex
CREATE UNIQUE INDEX "School_name_key" ON "School"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Rider_riderNo_key" ON "Rider"("riderNo");

-- CreateIndex
CREATE INDEX "Rider_schoolId_idx" ON "Rider"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Horse_name_key" ON "Horse"("name");

-- CreateIndex
CREATE INDEX "RunningOrder_classId_idx" ON "RunningOrder"("classId");

-- CreateIndex
CREATE INDEX "RunningOrder_riderId_idx" ON "RunningOrder"("riderId");

-- CreateIndex
CREATE INDEX "RunningOrder_horseId_idx" ON "RunningOrder"("horseId");

-- CreateIndex
CREATE INDEX "RunningOrder_status_idx" ON "RunningOrder"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RunningOrder_classId_plannedOrderNo_key" ON "RunningOrder"("classId", "plannedOrderNo");

-- CreateIndex
CREATE UNIQUE INDEX "RunningOrder_classId_riderId_key" ON "RunningOrder"("classId", "riderId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_runningOrderId_key" ON "Result"("runningOrderId");

-- CreateIndex
CREATE INDEX "Result_resultStatus_idx" ON "Result"("resultStatus");

-- CreateIndex
CREATE INDEX "Result_published_idx" ON "Result"("published");

-- CreateIndex
CREATE INDEX "StatusHistory_runningOrderId_idx" ON "StatusHistory"("runningOrderId");

-- CreateIndex
CREATE INDEX "StatusHistory_changedAt_idx" ON "StatusHistory"("changedAt");

-- CreateIndex
CREATE INDEX "TimerEvent_runningOrderId_idx" ON "TimerEvent"("runningOrderId");

-- CreateIndex
CREATE INDEX "TimerEvent_eventType_idx" ON "TimerEvent"("eventType");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_subscriptionStatus_idx" ON "User"("subscriptionStatus");

-- AddForeignKey
ALTER TABLE "Arena" ADD CONSTRAINT "Arena_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionClass" ADD CONSTRAINT "CompetitionClass_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionClass" ADD CONSTRAINT "CompetitionClass_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningOrder" ADD CONSTRAINT "RunningOrder_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CompetitionClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningOrder" ADD CONSTRAINT "RunningOrder_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningOrder" ADD CONSTRAINT "RunningOrder_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "Horse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_runningOrderId_fkey" FOREIGN KEY ("runningOrderId") REFERENCES "RunningOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_runningOrderId_fkey" FOREIGN KEY ("runningOrderId") REFERENCES "RunningOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimerEvent" ADD CONSTRAINT "TimerEvent_runningOrderId_fkey" FOREIGN KEY ("runningOrderId") REFERENCES "RunningOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

