/**
 * scripts/migrate-to-neon.ts
 *
 * Reads ALL data from the local SQLite dev.db and inserts it into the
 * new Neon PostgreSQL database in foreign-key dependency order.
 *
 * Run with:
 *   npx tsx scripts/migrate-to-neon.ts
 *
 * Requires: DB_DATABASE_URL and DB_DIRECT_URL set in .env.local
 */

import { execSync }  from 'child_process';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// ─── Config ──────────────────────────────────────────────────────────────────

const DB_PATH   = path.resolve(process.cwd(), 'dev.db');
const BATCH     = 200; // rows per createMany call

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Query SQLite and return typed rows. */
function sq<T = Record<string, unknown>>(sql: string): T[] {
  try {
    const out = execSync(`sqlite3 "${DB_PATH}" -json "${sql.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return out ? (JSON.parse(out) as T[]) : [];
  } catch {
    return [];
  }
}

/** SQLite returns ISO strings for DateTime; convert to JS Date. */
function d(v: string | null | undefined): Date | null {
  return v ? new Date(v) : null;
}

/** SQLite stores booleans as 0 / 1. */
function b(v: number | boolean | null | undefined): boolean {
  return v === 1 || v === true;
}

/** Chunk an array into batches. */
function chunks<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

async function insert<T>(
  label: string,
  rows: T[],
  fn: (batch: T[]) => Promise<{ count: number }>,
): Promise<void> {
  if (rows.length === 0) { console.log(`  ⊘  ${label}: 0 rows — skipping`); return; }
  let total = 0;
  for (const batch of chunks(rows, BATCH)) {
    const { count } = await fn(batch);
    total += count;
  }
  console.log(`  ✓  ${label}: ${total} rows`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀  LiveRide — SQLite → Neon PostgreSQL migration\n');
  console.log(`Source : ${DB_PATH}`);
  console.log(`Target : ${process.env.DB_DATABASE_URL?.split('@')[1]?.split('/')[1] ?? 'Neon'}\n`);

  const neon = new PrismaClient({
    log: [],
  });

  try {
    // ── 1. Event ─────────────────────────────────────────────────────────────
    type SqlEvent = {
      id: string; name: string; eventDate: string; venue: string;
      qualifier: string; status: string; createdAt: string; updatedAt: string;
    };
    const events = sq<SqlEvent>('SELECT * FROM Event');
    await insert('Event', events, (batch) =>
      neon.event.createMany({
        data: batch.map(r => ({
          id:        r.id,
          name:      r.name,
          eventDate: d(r.eventDate)!,
          venue:     r.venue,
          qualifier: r.qualifier,
          status:    r.status,
          createdAt: d(r.createdAt)!,
          updatedAt: d(r.updatedAt)!,
        })),
        skipDuplicates: true,
      }),
    );

    // ── 2. School ────────────────────────────────────────────────────────────
    type SqlSchool = { id: string; name: string; createdAt: string; updatedAt: string };
    const schools = sq<SqlSchool>('SELECT * FROM School');
    await insert('School', schools, (batch) =>
      neon.school.createMany({
        data: batch.map(r => ({
          id: r.id, name: r.name,
          createdAt: d(r.createdAt)!, updatedAt: d(r.updatedAt)!,
        })),
        skipDuplicates: true,
      }),
    );

    // ── 3. Horse ─────────────────────────────────────────────────────────────
    type SqlHorse = { id: string; name: string; type: string; createdAt: string; updatedAt: string };
    const horses = sq<SqlHorse>('SELECT * FROM Horse');
    await insert('Horse', horses, (batch) =>
      neon.horse.createMany({
        data: batch.map(r => ({
          id: r.id, name: r.name, type: r.type,
          createdAt: d(r.createdAt)!, updatedAt: d(r.updatedAt)!,
        })),
        skipDuplicates: true,
      }),
    );

    // ── 4. User ──────────────────────────────────────────────────────────────
    type SqlUser = {
      id: string; email: string; name: string; passwordHash: string | null;
      role: string; viewerPackage: string | null; deviceLimit: number;
      subscriptionStatus: string; subscriptionEndsAt: string | null;
      createdAt: string; updatedAt: string;
    };
    const users = sq<SqlUser>('SELECT * FROM User');
    await insert('User', users, (batch) =>
      neon.user.createMany({
        data: batch.map(r => ({
          id:                 r.id,
          email:              r.email,
          name:               r.name,
          passwordHash:       r.passwordHash ?? null,
          role:               r.role,
          viewerPackage:      r.viewerPackage ?? null,
          deviceLimit:        Number(r.deviceLimit),
          subscriptionStatus: r.subscriptionStatus,
          subscriptionEndsAt: d(r.subscriptionEndsAt),
          createdAt:          d(r.createdAt)!,
          updatedAt:          d(r.updatedAt)!,
        })),
        skipDuplicates: true,
      }),
    );

    // ── 5. Arena ─────────────────────────────────────────────────────────────
    type SqlArena = {
      id: string; eventId: string; name: string; discipline: string;
      status: string; sortOrder: number; createdAt: string; updatedAt: string;
    };
    const arenas = sq<SqlArena>('SELECT * FROM Arena');
    await insert('Arena', arenas, (batch) =>
      neon.arena.createMany({
        data: batch.map(r => ({
          id: r.id, eventId: r.eventId, name: r.name,
          discipline: r.discipline, status: r.status,
          sortOrder: Number(r.sortOrder),
          createdAt: d(r.createdAt)!, updatedAt: d(r.updatedAt)!,
        })),
        skipDuplicates: true,
      }),
    );

    // ── 6. CompetitionClass ──────────────────────────────────────────────────
    type SqlClass = {
      id: string; eventId: string; arenaId: string; classCode: string;
      name: string; discipline: string; height: string; competitionType: string;
      feiArticle: string | null; scheduledStartTime: string;
      expectedRiders: number; sortOrder: number; status: string;
      createdAt: string; updatedAt: string;
    };
    const classes = sq<SqlClass>('SELECT * FROM CompetitionClass');
    await insert('CompetitionClass', classes, (batch) =>
      neon.competitionClass.createMany({
        data: batch.map(r => ({
          id:                 r.id,
          eventId:            r.eventId,
          arenaId:            r.arenaId,
          classCode:          r.classCode,
          name:               r.name,
          discipline:         r.discipline,
          height:             r.height,
          competitionType:    r.competitionType,
          feiArticle:         r.feiArticle ?? null,
          scheduledStartTime: r.scheduledStartTime,
          expectedRiders:     Number(r.expectedRiders),
          sortOrder:          Number(r.sortOrder),
          status:             r.status,
          createdAt:          d(r.createdAt)!,
          updatedAt:          d(r.updatedAt)!,
        })),
        skipDuplicates: true,
      }),
    );

    // ── 7. Rider ─────────────────────────────────────────────────────────────
    type SqlRider = {
      id: string; riderNo: string; fullName: string; schoolId: string;
      createdAt: string; updatedAt: string;
    };
    const riders = sq<SqlRider>('SELECT * FROM Rider');
    await insert('Rider', riders, (batch) =>
      neon.rider.createMany({
        data: batch.map(r => ({
          id: r.id, riderNo: r.riderNo, fullName: r.fullName, schoolId: r.schoolId,
          createdAt: d(r.createdAt)!, updatedAt: d(r.updatedAt)!,
        })),
        skipDuplicates: true,
      }),
    );

    // ── 8. RunningOrder ──────────────────────────────────────────────────────
    type SqlRO = {
      id: string; classId: string; riderId: string; horseId: string;
      plannedOrderNo: number; actualOrderNo: number | null; plannedTime: string | null;
      status: string; orderChanged: number; orderChangeReason: string | null;
      notes: string | null; checkedInAt: string | null; startedAt: string | null;
      finishedAt: string | null; createdAt: string; updatedAt: string;
    };
    const ros = sq<SqlRO>('SELECT * FROM RunningOrder');
    await insert('RunningOrder', ros, (batch) =>
      neon.runningOrder.createMany({
        data: batch.map(r => ({
          id:                 r.id,
          classId:            r.classId,
          riderId:            r.riderId,
          horseId:            r.horseId,
          plannedOrderNo:     Number(r.plannedOrderNo),
          actualOrderNo:      r.actualOrderNo != null ? Number(r.actualOrderNo) : null,
          plannedTime:        r.plannedTime ?? null,
          status:             r.status,
          orderChanged:       b(r.orderChanged),
          orderChangeReason:  r.orderChangeReason ?? null,
          notes:              r.notes ?? null,
          checkedInAt:        d(r.checkedInAt),
          startedAt:          d(r.startedAt),
          finishedAt:         d(r.finishedAt),
          createdAt:          d(r.createdAt)!,
          updatedAt:          d(r.updatedAt)!,
        })),
        skipDuplicates: true,
      }),
    );

    // ── 9. Result ────────────────────────────────────────────────────────────
    type SqlResult = {
      id: string; runningOrderId: string; elapsedSeconds: number | null;
      faults: number | null; penalties: number | null; placing: number | null;
      resultStatus: string; published: number; createdAt: string; updatedAt: string;
    };
    const results = sq<SqlResult>('SELECT * FROM Result');
    await insert('Result', results, (batch) =>
      neon.result.createMany({
        data: batch.map(r => ({
          id:             r.id,
          runningOrderId: r.runningOrderId,
          elapsedSeconds: r.elapsedSeconds != null ? Number(r.elapsedSeconds) : null,
          faults:         r.faults != null ? Number(r.faults) : null,
          penalties:      r.penalties != null ? Number(r.penalties) : null,
          placing:        r.placing != null ? Number(r.placing) : null,
          resultStatus:   r.resultStatus,
          published:      b(r.published),
          createdAt:      d(r.createdAt)!,
          updatedAt:      d(r.updatedAt)!,
        })),
        skipDuplicates: true,
      }),
    );

    // ── 10. StatusHistory ────────────────────────────────────────────────────
    type SqlSH = {
      id: string; runningOrderId: string; oldStatus: string | null;
      newStatus: string; reason: string | null; changedBy: string | null;
      changedAt: string;
    };
    const history = sq<SqlSH>('SELECT * FROM StatusHistory');
    await insert('StatusHistory', history, (batch) =>
      neon.statusHistory.createMany({
        data: batch.map(r => ({
          id:             r.id,
          runningOrderId: r.runningOrderId,
          oldStatus:      r.oldStatus ?? null,
          newStatus:      r.newStatus,
          reason:         r.reason ?? null,
          changedBy:      r.changedBy ?? null,
          changedAt:      d(r.changedAt)!,
        })),
        skipDuplicates: true,
      }),
    );

    // ── 11. TimerEvent ───────────────────────────────────────────────────────
    type SqlTE = {
      id: string; runningOrderId: string; eventType: string;
      eventTime: string; source: string | null; capturedBy: string | null;
    };
    const timerEvents = sq<SqlTE>('SELECT * FROM TimerEvent');
    await insert('TimerEvent', timerEvents, (batch) =>
      neon.timerEvent.createMany({
        data: batch.map(r => ({
          id:             r.id,
          runningOrderId: r.runningOrderId,
          eventType:      r.eventType,
          eventTime:      d(r.eventTime)!,
          source:         r.source ?? null,
          capturedBy:     r.capturedBy ?? null,
        })),
        skipDuplicates: true,
      }),
    );

    console.log('\n✅  Migration complete.\n');
  } catch (err) {
    console.error('\n❌  Migration failed:', err);
    process.exit(1);
  } finally {
    await neon.$disconnect();
  }
}

main();
