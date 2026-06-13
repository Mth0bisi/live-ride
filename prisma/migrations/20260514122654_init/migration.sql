-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "venue" TEXT NOT NULL,
    "qualifier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Arena" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Arena_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompetitionClass" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CompetitionClass_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CompetitionClass_arenaId_fkey" FOREIGN KEY ("arenaId") REFERENCES "Arena" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Rider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "riderNo" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rider_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Horse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RunningOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "horseId" TEXT NOT NULL,
    "plannedOrderNo" INTEGER NOT NULL,
    "actualOrderNo" INTEGER,
    "plannedTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "orderChanged" BOOLEAN NOT NULL DEFAULT false,
    "orderChangeReason" TEXT,
    "checkedInAt" DATETIME,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RunningOrder_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CompetitionClass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RunningOrder_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RunningOrder_horseId_fkey" FOREIGN KEY ("horseId") REFERENCES "Horse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runningOrderId" TEXT NOT NULL,
    "elapsedSeconds" REAL,
    "faults" INTEGER,
    "penalties" INTEGER,
    "placing" INTEGER,
    "resultStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Result_runningOrderId_fkey" FOREIGN KEY ("runningOrderId") REFERENCES "RunningOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runningOrderId" TEXT NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT NOT NULL,
    "reason" TEXT,
    "changedBy" TEXT,
    "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StatusHistory_runningOrderId_fkey" FOREIGN KEY ("runningOrderId") REFERENCES "RunningOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimerEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runningOrderId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "capturedBy" TEXT,
    CONSTRAINT "TimerEvent_runningOrderId_fkey" FOREIGN KEY ("runningOrderId") REFERENCES "RunningOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Result_runningOrderId_key" ON "Result"("runningOrderId");
