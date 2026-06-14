const fs = require('fs');
const path = require('path');

const sqlFilePath = path.join(__dirname, 'seed.sql');

// 1. Data Definitions
const eventId = 'bryneven-winter-2026';
const eventName = 'Bryneven Winter Showjumping Festival 2026';
const eventVenue = 'Bryneven Equestrian Centre';
const eventDate = '2026-06-20 08:00:00.000';
const qualifier = 'SANESA Qualifier';
const eventStatus = 'ACTIVE';

const arenas = [
  { id: 'arena-main', name: 'Main Arena', discipline: 'SHOWJUMPING', status: 'ACTIVE', sortOrder: 1 },
  { id: 'arena-warmup', name: 'Warmup Arena', discipline: 'SHOWJUMPING', status: 'ACTIVE', sortOrder: 2 },
  { id: 'arena-derby', name: 'Derby Arena', discipline: 'SHOWJUMPING', status: 'ACTIVE', sortOrder: 3 },
];

const classes = [
  { id: 'class-sj01', arenaId: 'arena-main', classCode: 'SJ01', name: '80cm Novice', discipline: 'SHOWJUMPING', height: '80cm', type: 'A2 COMPETITION', time: '08:00', sort: 1, status: 'ACTIVE' },
  { id: 'class-sj02', arenaId: 'arena-main', classCode: 'SJ02', name: '90cm Novice', discipline: 'SHOWJUMPING', height: '90cm', type: 'A2 COMPETITION', time: '09:00', sort: 2, status: 'ACTIVE' },
  { id: 'class-sj03', arenaId: 'arena-warmup', classCode: 'SJ03', name: '1.00m Open', discipline: 'SHOWJUMPING', height: '100cm', type: '2PHASE COMPETITION', time: '10:30', sort: 3, status: 'ACTIVE' },
  { id: 'class-sj04', arenaId: 'arena-warmup', classCode: 'SJ04', name: '1.10m Open', discipline: 'SHOWJUMPING', height: '110cm', type: '2PHASE COMPETITION', time: '11:30', sort: 4, status: 'ACTIVE' },
  { id: 'class-sj05', arenaId: 'arena-derby', classCode: 'SJ05', name: '1.20m Championship', discipline: 'SHOWJUMPING', height: '120cm', type: 'CHAMPIONSHIP', time: '13:00', sort: 5, status: 'PENDING' },
  { id: 'class-sj06', arenaId: 'arena-derby', classCode: 'SJ06', name: 'Derby Championship', discipline: 'SHOWJUMPING', height: '120cm', type: 'DERBY', time: '14:30', sort: 6, status: 'PENDING' },
];

const schools = [
  { id: 'school-1', name: 'Bryneven Primary' },
  { id: 'school-2', name: 'Crawford Sandton' },
  { id: 'school-3', name: 'Redhill School' },
  { id: 'school-4', name: 'St Stithians' },
  { id: 'school-5', name: 'King David' },
];

const riderFirstNames = [
  'Emma', 'Liam', 'Ava', 'Noah', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James',
  'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Alexander', 'Evelyn', 'Michael', 'Abigail', 'Daniel',
  'Emily', 'Jacob', 'Elizabeth', 'Logan', 'Sofia', 'Jackson', 'Avery', 'Sebastian', 'Ella', 'Jack',
  'Madison', 'Aiden', 'Scarlett', 'Owen', 'Victoria', 'Samuel', 'Aria', 'Matthew', 'Grace', 'Henry'
];
const riderLastNames = [
  'Smith', 'Brown', 'Johnson', 'Williams', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez',
  'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez',
  'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young',
  'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Carter', 'Mitchell'
];

const horseNames = [
  'Thunder', 'Apollo', 'Shadow', 'Spirit', 'Storm', 'Majestic', 'Titan', 'Blaze', 'Silver', 'Comet',
  'Eclipse', 'Phantom', 'Midnight', 'Goldie', 'Star', 'Pegasus', 'Trigger', 'Rusty', 'Duchess', 'Bella',
  'Zorro', 'Cavalier', 'Whisper', 'Goliath', 'Destiny', 'Arrow', 'Ranger', 'Legacy', 'Justice', 'Zephyr',
  'Pioneer', 'Liberty', 'Sentinel', 'Tornado', 'Wildfire', 'Starlight', 'Sterling', 'Valiant', 'Outlaw', 'Legend'
];

// 2. Generate SQL Queries
const sqlLines = [];

sqlLines.push('-- Clear existing database records');
sqlLines.push('TRUNCATE TABLE "TimerEvent", "StatusHistory", "Result", "RunningOrder", "CompetitionClass", "Arena", "Event", "Rider", "Horse", "School" CASCADE;\n');

sqlLines.push('-- Seed Event');
sqlLines.push(`INSERT INTO "Event" ("id", "name", "venue", "eventDate", "qualifier", "status", "createdAt", "updatedAt")`);
sqlLines.push(`VALUES ('${eventId}', '${eventName}', '${eventVenue}', '${eventDate}', '${qualifier}', '${eventStatus}', NOW(), NOW());\n`);

sqlLines.push('-- Seed Arenas');
for (const a of arenas) {
  sqlLines.push(`INSERT INTO "Arena" ("id", "eventId", "name", "discipline", "status", "sortOrder", "createdAt", "updatedAt")`);
  sqlLines.push(`VALUES ('${a.id}', '${eventId}', '${a.name}', '${a.discipline}', '${a.status}', ${a.sortOrder}, NOW(), NOW());`);
}
sqlLines.push('');

sqlLines.push('-- Seed Competition Classes');
for (const c of classes) {
  sqlLines.push(`INSERT INTO "CompetitionClass" ("id", "eventId", "arenaId", "classCode", "name", "discipline", "height", "competitionType", "scheduledStartTime", "expectedRiders", "sortOrder", "status", "createdAt", "updatedAt")`);
  sqlLines.push(`VALUES ('${c.id}', '${eventId}', '${c.arenaId}', '${c.classCode}', '${c.name}', '${c.discipline}', '${c.height}', '${c.type}', '${c.time}', 10, ${c.sort}, '${c.status}', NOW(), NOW());`);
}
sqlLines.push('');

sqlLines.push('-- Seed Schools');
for (const s of schools) {
  sqlLines.push(`INSERT INTO "School" ("id", "name", "createdAt", "updatedAt") VALUES ('${s.id}', '${s.name}', NOW(), NOW());`);
}
sqlLines.push('');

sqlLines.push('-- Seed Riders');
const riders = [];
for (let i = 0; i < 40; i++) {
  const id = `rider-id-${i + 1}`;
  const riderNo = `R${(i + 1).toString().padStart(3, '0')}`;
  const fullName = `${riderFirstNames[i]} ${riderLastNames[i]}`;
  const schoolIndex = Math.floor(i / 8);
  const schoolId = schools[schoolIndex].id;
  riders.push({ id, riderNo, fullName, schoolId });
  sqlLines.push(`INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('${id}', '${riderNo}', '${fullName.replace(/'/g, "''")}', '${schoolId}', NOW(), NOW());`);
}
sqlLines.push('');

sqlLines.push('-- Seed Horses');
const horses = [];
for (let i = 0; i < 40; i++) {
  const id = `horse-id-${i + 1}`;
  const name = horseNames[i];
  horses.push({ id, name });
  sqlLines.push(`INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('${id}', '${name.replace(/'/g, "''")}', 'HORSE', NOW(), NOW());`);
}
sqlLines.push('');

sqlLines.push('-- Seed Running Orders, Results, StatusHistory, and TimerEvents');
const classesToSeed = [
  { id: 'class-sj01', code: 'SJ01' },
  { id: 'class-sj02', code: 'SJ02' },
  { id: 'class-sj03', code: 'SJ03' },
  { id: 'class-sj04', code: 'SJ04' },
];

let riderOffset = 0;
const resultsToCreate = [
  { elapsedSeconds: 58.23, faults: 0, penalties: 0, placing: 1 },
  { elapsedSeconds: 61.12, faults: 4, penalties: 0, placing: 2 }
];

let historyCount = 1;
let timerEventCount = 1;
let resultCount = 1;

for (const cc of classesToSeed) {
  for (let plannedOrderNo = 1; plannedOrderNo <= 10; plannedOrderNo++) {
    const riderIndex = riderOffset + (plannedOrderNo - 1);
    const rider = riders[riderIndex];
    const horse = horses[riderIndex];
    const roId = `ro-${cc.code}-${plannedOrderNo}`;

    let status = 'SCHEDULED';
    if (plannedOrderNo === 1 || plannedOrderNo === 2) {
      status = 'FINISHED';
    } else if (plannedOrderNo === 3) {
      status = 'IN_ARENA';
    } else if (plannedOrderNo === 4 || plannedOrderNo === 5) {
      status = 'CHECKED_IN';
    }

    const hasResult = status === 'FINISHED';
    
    // Dates
    const checkedInAt = status !== 'SCHEDULED' ? "NOW() - INTERVAL '30 minutes'" : 'NULL';
    const startedAt = hasResult || status === 'IN_ARENA' ? "NOW() - INTERVAL '10 minutes'" : 'NULL';
    const finishedAt = hasResult ? "NOW() - INTERVAL '5 minutes'" : 'NULL';

    sqlLines.push(`INSERT INTO "RunningOrder" ("id", "classId", "riderId", "horseId", "plannedOrderNo", "status", "checkedInAt", "startedAt", "finishedAt", "createdAt", "updatedAt")`);
    sqlLines.push(`VALUES ('${roId}', '${cc.id}', '${rider.id}', '${horse.id}', ${plannedOrderNo}, '${status}', ${checkedInAt}, ${startedAt}, ${finishedAt}, NOW(), NOW());`);

    // Status History
    if (status !== 'SCHEDULED') {
      sqlLines.push(`INSERT INTO "StatusHistory" ("id", "runningOrderId", "oldStatus", "newStatus", "reason", "changedBy", "changedAt")`);
      sqlLines.push(`VALUES ('hist-${historyCount++}', '${roId}', 'SCHEDULED', 'CHECKED_IN', 'Rider checked in', 'system-demo', NOW());`);
    }

    if (status === 'IN_ARENA' || hasResult) {
      sqlLines.push(`INSERT INTO "StatusHistory" ("id", "runningOrderId", "oldStatus", "newStatus", "reason", "changedBy", "changedAt")`);
      sqlLines.push(`VALUES ('hist-${historyCount++}', '${roId}', 'CHECKED_IN', 'IN_ARENA', 'Rider entered the arena', 'system-demo', NOW());`);

      // Timer START
      sqlLines.push(`INSERT INTO "TimerEvent" ("id", "runningOrderId", "eventType", "source", "capturedBy", "eventTime")`);
      sqlLines.push(`VALUES ('te-${timerEventCount++}', '${roId}', 'START', 'timer', 'demo-user', NOW());`);
    }

    if (hasResult) {
      sqlLines.push(`INSERT INTO "StatusHistory" ("id", "runningOrderId", "oldStatus", "newStatus", "reason", "changedBy", "changedAt")`);
      sqlLines.push(`VALUES ('hist-${historyCount++}', '${roId}', 'IN_ARENA', 'FINISHED', 'Round finished successfully', 'system-demo', NOW());`);

      // Timer FINISH
      sqlLines.push(`INSERT INTO "TimerEvent" ("id", "runningOrderId", "eventType", "source", "capturedBy", "eventTime")`);
      sqlLines.push(`VALUES ('te-${timerEventCount++}', '${roId}', 'FINISH', 'timer', 'demo-user', NOW());`);

      // Result
      const res = resultsToCreate[plannedOrderNo - 1];
      sqlLines.push(`INSERT INTO "Result" ("id", "runningOrderId", "elapsedSeconds", "faults", "penalties", "placing", "resultStatus", "published", "createdAt", "updatedAt")`);
      sqlLines.push(`VALUES ('res-${resultCount++}', '${roId}', ${res.elapsedSeconds}, ${res.faults}, ${res.penalties}, ${res.placing}, 'CONFIRMED', true, NOW(), NOW());`);
    }
  }
  riderOffset += 10;
}

fs.writeFileSync(sqlFilePath, sqlLines.join('\n'), 'utf8');
console.log('✅ Generated seed.sql successfully.');
