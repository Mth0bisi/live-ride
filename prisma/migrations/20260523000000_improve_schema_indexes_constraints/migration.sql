-- Migration: improve_schema_indexes_constraints
-- Adds unique constraints, indexes, cascade rules, sortOrder on Arena, notes on RunningOrder

-- ─── Arena: add sortOrder column ────────────────────────────────────────────
ALTER TABLE "Arena" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- ─── RunningOrder: add notes column ─────────────────────────────────────────
ALTER TABLE "RunningOrder" ADD COLUMN "notes" TEXT;

-- ─── Unique constraints ──────────────────────────────────────────────────────
-- School.name must be unique (prevent duplicate school records)
CREATE UNIQUE INDEX "School_name_key" ON "School"("name");

-- Rider.riderNo is the SANESA membership number — globally unique
CREATE UNIQUE INDEX "Rider_riderNo_key" ON "Rider"("riderNo");

-- Horse.name is the registered name — unique across the system
CREATE UNIQUE INDEX "Horse_name_key" ON "Horse"("name");

-- CompetitionClass: classCode must be unique per event
CREATE UNIQUE INDEX "CompetitionClass_eventId_classCode_key" ON "CompetitionClass"("eventId", "classCode");

-- RunningOrder: two riders cannot share the same planned order slot in a class
CREATE UNIQUE INDEX "RunningOrder_classId_plannedOrderNo_key" ON "RunningOrder"("classId", "plannedOrderNo");

-- RunningOrder: a rider can only appear once per class
CREATE UNIQUE INDEX "RunningOrder_classId_riderId_key" ON "RunningOrder"("classId", "riderId");

-- ─── Indexes on FK columns and hot query paths ───────────────────────────────

-- Event
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- Arena
CREATE INDEX "Arena_eventId_idx" ON "Arena"("eventId");
CREATE INDEX "Arena_status_idx" ON "Arena"("status");

-- CompetitionClass
CREATE INDEX "CompetitionClass_arenaId_idx" ON "CompetitionClass"("arenaId");
CREATE INDEX "CompetitionClass_eventId_idx" ON "CompetitionClass"("eventId");
CREATE INDEX "CompetitionClass_status_idx" ON "CompetitionClass"("status");

-- Rider
CREATE INDEX "Rider_schoolId_idx" ON "Rider"("schoolId");

-- RunningOrder
CREATE INDEX "RunningOrder_classId_idx" ON "RunningOrder"("classId");
CREATE INDEX "RunningOrder_riderId_idx" ON "RunningOrder"("riderId");
CREATE INDEX "RunningOrder_horseId_idx" ON "RunningOrder"("horseId");
CREATE INDEX "RunningOrder_status_idx" ON "RunningOrder"("status");

-- Result
CREATE INDEX "Result_resultStatus_idx" ON "Result"("resultStatus");
CREATE INDEX "Result_published_idx" ON "Result"("published");

-- StatusHistory
CREATE INDEX "StatusHistory_runningOrderId_idx" ON "StatusHistory"("runningOrderId");
CREATE INDEX "StatusHistory_changedAt_idx" ON "StatusHistory"("changedAt");

-- TimerEvent
CREATE INDEX "TimerEvent_runningOrderId_idx" ON "TimerEvent"("runningOrderId");
CREATE INDEX "TimerEvent_eventType_idx" ON "TimerEvent"("eventType");
