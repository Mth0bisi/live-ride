-- ============================================================
-- Live Ride Platform — Full Production Seed
-- Events: 1 COMPLETE (past), 2 ACTIVE (live today), 1 UPCOMING
-- Run this in your Neon SQL editor to reset & seed all data.
-- ============================================================

-- Clear existing database records
TRUNCATE TABLE "TimerEvent", "StatusHistory", "Result", "RunningOrder", "CompetitionClass", "Arena", "Event", "Rider", "Horse", "School" CASCADE;

-- ============================================================
-- SCHOOLS (shared across all events)
-- ============================================================
INSERT INTO "School" ("id", "name", "createdAt", "updatedAt") VALUES ('school-1', 'Bryneven Primary', NOW(), NOW());
INSERT INTO "School" ("id", "name", "createdAt", "updatedAt") VALUES ('school-2', 'Crawford Sandton', NOW(), NOW());
INSERT INTO "School" ("id", "name", "createdAt", "updatedAt") VALUES ('school-3', 'Redhill School', NOW(), NOW());
INSERT INTO "School" ("id", "name", "createdAt", "updatedAt") VALUES ('school-4', 'St Stithians', NOW(), NOW());
INSERT INTO "School" ("id", "name", "createdAt", "updatedAt") VALUES ('school-5', 'King David', NOW(), NOW());
INSERT INTO "School" ("id", "name", "createdAt", "updatedAt") VALUES ('school-6', 'Roedean School', NOW(), NOW());
INSERT INTO "School" ("id", "name", "createdAt", "updatedAt") VALUES ('school-7', 'Greenside High', NOW(), NOW());

-- ============================================================
-- RIDERS (50 riders, shared pool)
-- ============================================================
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-1', 'R001', 'Emma Smith', 'school-1', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-2', 'R002', 'Liam Brown', 'school-1', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-3', 'R003', 'Ava Johnson', 'school-1', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-4', 'R004', 'Noah Williams', 'school-1', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-5', 'R005', 'Sophia Miller', 'school-1', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-6', 'R006', 'Mason Davis', 'school-1', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-7', 'R007', 'Isabella Garcia', 'school-1', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-8', 'R008', 'William Rodriguez', 'school-1', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-9', 'R009', 'Mia Wilson', 'school-2', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-10', 'R010', 'James Martinez', 'school-2', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-11', 'R011', 'Charlotte Anderson', 'school-2', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-12', 'R012', 'Benjamin Taylor', 'school-2', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-13', 'R013', 'Amelia Thomas', 'school-2', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-14', 'R014', 'Lucas Hernandez', 'school-2', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-15', 'R015', 'Harper Moore', 'school-2', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-16', 'R016', 'Alexander Martin', 'school-2', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-17', 'R017', 'Evelyn Jackson', 'school-3', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-18', 'R018', 'Michael Thompson', 'school-3', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-19', 'R019', 'Abigail White', 'school-3', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-20', 'R020', 'Daniel Lopez', 'school-3', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-21', 'R021', 'Emily Lee', 'school-3', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-22', 'R022', 'Jacob Gonzalez', 'school-3', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-23', 'R023', 'Elizabeth Harris', 'school-3', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-24', 'R024', 'Logan Clark', 'school-3', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-25', 'R025', 'Sofia Lewis', 'school-4', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-26', 'R026', 'Jackson Robinson', 'school-4', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-27', 'R027', 'Avery Walker', 'school-4', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-28', 'R028', 'Sebastian Perez', 'school-4', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-29', 'R029', 'Ella Hall', 'school-4', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-30', 'R030', 'Jack Young', 'school-4', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-31', 'R031', 'Madison Allen', 'school-4', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-32', 'R032', 'Aiden Sanchez', 'school-4', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-33', 'R033', 'Scarlett Wright', 'school-5', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-34', 'R034', 'Owen King', 'school-5', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-35', 'R035', 'Victoria Scott', 'school-5', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-36', 'R036', 'Samuel Green', 'school-5', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-37', 'R037', 'Aria Baker', 'school-5', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-38', 'R038', 'Matthew Adams', 'school-5', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-39', 'R039', 'Grace Carter', 'school-5', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-40', 'R040', 'Henry Mitchell', 'school-5', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-41', 'R041', 'Zoe Turner', 'school-6', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-42', 'R042', 'Ethan Parker', 'school-6', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-43', 'R043', 'Lily Evans', 'school-6', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-44', 'R044', 'Oliver Reed', 'school-6', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-45', 'R045', 'Chloe Hughes', 'school-6', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-46', 'R046', 'Nathan Price', 'school-7', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-47', 'R047', 'Hannah Flores', 'school-7', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-48', 'R048', 'Ryan Bennett', 'school-7', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-49', 'R049', 'Zara Coleman', 'school-7', NOW(), NOW());
INSERT INTO "Rider" ("id", "riderNo", "fullName", "schoolId", "createdAt", "updatedAt") VALUES ('rider-50', 'R050', 'Tyler Morris', 'school-7', NOW(), NOW());

-- ============================================================
-- HORSES (50 horses)
-- ============================================================
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-1', 'Thunder', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-2', 'Apollo', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-3', 'Shadow', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-4', 'Spirit', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-5', 'Storm', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-6', 'Majestic', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-7', 'Titan', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-8', 'Blaze', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-9', 'Silver', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-10', 'Comet', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-11', 'Eclipse', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-12', 'Phantom', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-13', 'Midnight', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-14', 'Goldie', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-15', 'Star', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-16', 'Pegasus', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-17', 'Trigger', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-18', 'Rusty', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-19', 'Duchess', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-20', 'Bella', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-21', 'Zorro', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-22', 'Cavalier', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-23', 'Whisper', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-24', 'Goliath', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-25', 'Destiny', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-26', 'Arrow', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-27', 'Ranger', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-28', 'Legacy', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-29', 'Justice', 'PONY', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-30', 'Zephyr', 'PONY', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-31', 'Pioneer', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-32', 'Liberty', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-33', 'Sentinel', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-34', 'Tornado', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-35', 'Wildfire', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-36', 'Starlight', 'PONY', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-37', 'Sterling', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-38', 'Valiant', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-39', 'Outlaw', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-40', 'Legend', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-41', 'Falcon', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-42', 'Rapture', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-43', 'Horizon', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-44', 'Ember', 'PONY', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-45', 'Mystic', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-46', 'Cascade', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-47', 'Noble', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-48', 'Fuego', 'HORSE', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-49', 'Glimmer', 'PONY', NOW(), NOW());
INSERT INTO "Horse" ("id", "name", "type", "createdAt", "updatedAt") VALUES ('horse-50', 'Triumph', 'HORSE', NOW(), NOW());

-- ============================================================
-- EVENT 1: PAST / COMPLETE
-- Highveld Spring Classic 2026 — April 2026, all results done
-- ============================================================
INSERT INTO "Event" ("id", "name", "venue", "eventDate", "qualifier", "status", "createdAt", "updatedAt")
VALUES ('highveld-spring-2026', 'Highveld Spring Classic 2026', 'Highveld Equestrian Park', '2026-04-12 08:00:00.000', 'SANESA Qualifier', 'COMPLETE', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days');

-- Arenas
INSERT INTO "Arena" ("id", "eventId", "name", "discipline", "status", "sortOrder", "createdAt", "updatedAt")
VALUES ('hs-arena-a', 'highveld-spring-2026', 'Arena A', 'SHOWJUMPING', 'COMPLETE', 1, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days');
INSERT INTO "Arena" ("id", "eventId", "name", "discipline", "status", "sortOrder", "createdAt", "updatedAt")
VALUES ('hs-arena-b', 'highveld-spring-2026', 'Arena B', 'SHOWJUMPING', 'COMPLETE', 2, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days');

-- Classes
INSERT INTO "CompetitionClass" ("id", "eventId", "arenaId", "classCode", "name", "discipline", "height", "competitionType", "scheduledStartTime", "expectedRiders", "sortOrder", "status", "createdAt", "updatedAt")
VALUES ('hs-class-1', 'highveld-spring-2026', 'hs-arena-a', 'HS01', '70cm Grassroots', 'SHOWJUMPING', '70cm', 'A2 COMPETITION', '08:00', 8, 1, 'COMPLETE', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days');
INSERT INTO "CompetitionClass" ("id", "eventId", "arenaId", "classCode", "name", "discipline", "height", "competitionType", "scheduledStartTime", "expectedRiders", "sortOrder", "status", "createdAt", "updatedAt")
VALUES ('hs-class-2', 'highveld-spring-2026', 'hs-arena-a', 'HS02', '80cm Novice', 'SHOWJUMPING', '80cm', 'A2 COMPETITION', '09:30', 8, 2, 'COMPLETE', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days');
INSERT INTO "CompetitionClass" ("id", "eventId", "arenaId", "classCode", "name", "discipline", "height", "competitionType", "scheduledStartTime", "expectedRiders", "sortOrder", "status", "createdAt", "updatedAt")
VALUES ('hs-class-3', 'highveld-spring-2026', 'hs-arena-b', 'HS03', '1.00m Open', 'SHOWJUMPING', '100cm', '2PHASE COMPETITION', '11:00', 8, 3, 'COMPLETE', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days');
INSERT INTO "CompetitionClass" ("id", "eventId", "arenaId", "classCode", "name", "discipline", "height", "competitionType", "scheduledStartTime", "expectedRiders", "sortOrder", "status", "createdAt", "updatedAt")
VALUES ('hs-class-4', 'highveld-spring-2026', 'hs-arena-b', 'HS04', '1.10m Championship', 'SHOWJUMPING', '110cm', 'CHAMPIONSHIP', '13:30', 8, 4, 'COMPLETE', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days');

-- HS01 Running Orders (all FINISHED, results published)
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs01-1','hs-class-1','rider-1','horse-1',1,'FINISHED',NOW()-INTERVAL '60 days 5 hours',NOW()-INTERVAL '60 days 4 hours',NOW()-INTERVAL '60 days 3 hours 55 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs01-1','ro-hs01-1',62.44,0,0,1,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs01-2','hs-class-1','rider-2','horse-2',2,'FINISHED',NOW()-INTERVAL '60 days 5 hours',NOW()-INTERVAL '60 days 3 hours 50 minutes',NOW()-INTERVAL '60 days 3 hours 45 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs01-2','ro-hs01-2',65.10,4,0,2,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs01-3','hs-class-1','rider-3','horse-3',3,'FINISHED',NOW()-INTERVAL '60 days 5 hours',NOW()-INTERVAL '60 days 3 hours 40 minutes',NOW()-INTERVAL '60 days 3 hours 35 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs01-3','ro-hs01-3',70.02,4,0,3,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs01-4','hs-class-1','rider-4','horse-4',4,'FINISHED',NOW()-INTERVAL '60 days 5 hours',NOW()-INTERVAL '60 days 3 hours 30 minutes',NOW()-INTERVAL '60 days 3 hours 25 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs01-4','ro-hs01-4',74.88,8,0,4,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs01-5','hs-class-1','rider-5','horse-5',5,'FINISHED',NOW()-INTERVAL '60 days 5 hours',NOW()-INTERVAL '60 days 3 hours 20 minutes',NOW()-INTERVAL '60 days 3 hours 15 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs01-5','ro-hs01-5',59.77,0,0,2,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs01-6','hs-class-1','rider-6','horse-6',6,'FINISHED',NOW()-INTERVAL '60 days 5 hours',NOW()-INTERVAL '60 days 3 hours 10 minutes',NOW()-INTERVAL '60 days 3 hours 5 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs01-6','ro-hs01-6',81.33,8,0,5,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs01-7','hs-class-1','rider-7','horse-7',7,'FINISHED',NOW()-INTERVAL '60 days 5 hours',NOW()-INTERVAL '60 days 3 hours',NOW()-INTERVAL '60 days 2 hours 55 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs01-7','ro-hs01-7',67.20,0,0,3,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs01-8','hs-class-1','rider-8','horse-8',8,'FINISHED',NOW()-INTERVAL '60 days 5 hours',NOW()-INTERVAL '60 days 2 hours 50 minutes',NOW()-INTERVAL '60 days 2 hours 45 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs01-8','ro-hs01-8',78.91,4,0,4,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');

-- HS02 Running Orders (all FINISHED)
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs02-1','hs-class-2','rider-9','horse-9',1,'FINISHED',NOW()-INTERVAL '60 days 4 hours',NOW()-INTERVAL '60 days 2 hours 30 minutes',NOW()-INTERVAL '60 days 2 hours 25 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs02-1','ro-hs02-1',55.60,0,0,1,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs02-2','hs-class-2','rider-10','horse-10',2,'FINISHED',NOW()-INTERVAL '60 days 4 hours',NOW()-INTERVAL '60 days 2 hours 20 minutes',NOW()-INTERVAL '60 days 2 hours 15 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs02-2','ro-hs02-2',57.88,0,0,2,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs02-3','hs-class-2','rider-11','horse-11',3,'FINISHED',NOW()-INTERVAL '60 days 4 hours',NOW()-INTERVAL '60 days 2 hours 10 minutes',NOW()-INTERVAL '60 days 2 hours 5 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs02-3','ro-hs02-3',61.44,4,0,3,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs02-4','hs-class-2','rider-12','horse-12',4,'FINISHED',NOW()-INTERVAL '60 days 4 hours',NOW()-INTERVAL '60 days 2 hours',NOW()-INTERVAL '60 days 1 hour 55 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs02-4','ro-hs02-4',72.05,8,0,5,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs02-5','hs-class-2','rider-13','horse-13',5,'FINISHED',NOW()-INTERVAL '60 days 4 hours',NOW()-INTERVAL '60 days 1 hour 50 minutes',NOW()-INTERVAL '60 days 1 hour 45 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs02-5','ro-hs02-5',53.22,0,0,1,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs02-6','hs-class-2','rider-14','horse-14',6,'FINISHED',NOW()-INTERVAL '60 days 4 hours',NOW()-INTERVAL '60 days 1 hour 40 minutes',NOW()-INTERVAL '60 days 1 hour 35 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs02-6','ro-hs02-6',68.99,4,0,4,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs02-7','hs-class-2','rider-15','horse-15',7,'FINISHED',NOW()-INTERVAL '60 days 4 hours',NOW()-INTERVAL '60 days 1 hour 30 minutes',NOW()-INTERVAL '60 days 1 hour 25 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs02-7','ro-hs02-7',56.78,0,0,2,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs02-8','hs-class-2','rider-16','horse-16',8,'FINISHED',NOW()-INTERVAL '60 days 4 hours',NOW()-INTERVAL '60 days 1 hour 20 minutes',NOW()-INTERVAL '60 days 1 hour 15 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs02-8','ro-hs02-8',79.44,8,0,6,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');

-- HS03 Running Orders (all FINISHED)
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs03-1','hs-class-3','rider-17','horse-17',1,'FINISHED',NOW()-INTERVAL '60 days 3 hours',NOW()-INTERVAL '60 days 1 hour 10 minutes',NOW()-INTERVAL '60 days 1 hour 5 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs03-1','ro-hs03-1',58.30,0,0,1,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs03-2','hs-class-3','rider-18','horse-18',2,'FINISHED',NOW()-INTERVAL '60 days 3 hours',NOW()-INTERVAL '60 days 60 minutes',NOW()-INTERVAL '60 days 55 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs03-2','ro-hs03-2',61.50,0,0,2,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs03-3','hs-class-3','rider-19','horse-19',3,'FINISHED',NOW()-INTERVAL '60 days 3 hours',NOW()-INTERVAL '60 days 50 minutes',NOW()-INTERVAL '60 days 45 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs03-3','ro-hs03-3',75.11,4,0,3,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs03-4','hs-class-3','rider-20','horse-20',4,'FINISHED',NOW()-INTERVAL '60 days 3 hours',NOW()-INTERVAL '60 days 40 minutes',NOW()-INTERVAL '60 days 35 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs03-4','ro-hs03-4',80.22,8,0,5,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs03-5','hs-class-3','rider-21','horse-21',5,'FINISHED',NOW()-INTERVAL '60 days 3 hours',NOW()-INTERVAL '60 days 30 minutes',NOW()-INTERVAL '60 days 25 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs03-5','ro-hs03-5',56.77,0,0,1,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs03-6','hs-class-3','rider-22','horse-22',6,'FINISHED',NOW()-INTERVAL '60 days 3 hours',NOW()-INTERVAL '60 days 20 minutes',NOW()-INTERVAL '60 days 15 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs03-6','ro-hs03-6',62.05,0,0,2,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs03-7','hs-class-3','rider-23','horse-23',7,'FINISHED',NOW()-INTERVAL '60 days 3 hours',NOW()-INTERVAL '60 days 10 minutes',NOW()-INTERVAL '60 days 5 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs03-7','ro-hs03-7',69.44,4,0,4,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs03-8','hs-class-3','rider-24','horse-24',8,'FINISHED',NOW()-INTERVAL '60 days 3 hours',NOW()-INTERVAL '59 days 23 hours 55 minutes',NOW()-INTERVAL '59 days 23 hours 50 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs03-8','ro-hs03-8',77.89,8,0,6,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');

-- HS04 Running Orders (all FINISHED)
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs04-1','hs-class-4','rider-25','horse-25',1,'FINISHED',NOW()-INTERVAL '59 days 23 hours',NOW()-INTERVAL '59 days 22 hours 30 minutes',NOW()-INTERVAL '59 days 22 hours 25 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs04-1','ro-hs04-1',51.20,0,0,1,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs04-2','hs-class-4','rider-26','horse-26',2,'FINISHED',NOW()-INTERVAL '59 days 23 hours',NOW()-INTERVAL '59 days 22 hours 20 minutes',NOW()-INTERVAL '59 days 22 hours 15 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs04-2','ro-hs04-2',53.88,0,0,2,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs04-3','hs-class-4','rider-27','horse-27',3,'FINISHED',NOW()-INTERVAL '59 days 23 hours',NOW()-INTERVAL '59 days 22 hours 10 minutes',NOW()-INTERVAL '59 days 22 hours 5 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs04-3','ro-hs04-3',60.01,4,0,3,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs04-4','hs-class-4','rider-28','horse-28',4,'FINISHED',NOW()-INTERVAL '59 days 23 hours',NOW()-INTERVAL '59 days 22 hours',NOW()-INTERVAL '59 days 21 hours 55 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs04-4','ro-hs04-4',70.66,4,0,4,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs04-5','hs-class-4','rider-29','horse-29',5,'FINISHED',NOW()-INTERVAL '59 days 23 hours',NOW()-INTERVAL '59 days 21 hours 50 minutes',NOW()-INTERVAL '59 days 21 hours 45 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs04-5','ro-hs04-5',58.44,0,0,2,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs04-6','hs-class-4','rider-30','horse-30',6,'FINISHED',NOW()-INTERVAL '59 days 23 hours',NOW()-INTERVAL '59 days 21 hours 40 minutes',NOW()-INTERVAL '59 days 21 hours 35 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs04-6','ro-hs04-6',66.11,8,0,5,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs04-7','hs-class-4','rider-31','horse-31',7,'FINISHED',NOW()-INTERVAL '59 days 23 hours',NOW()-INTERVAL '59 days 21 hours 30 minutes',NOW()-INTERVAL '59 days 21 hours 25 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs04-7','ro-hs04-7',49.98,0,0,1,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-hs04-8','hs-class-4','rider-32','horse-32',8,'FINISHED',NOW()-INTERVAL '59 days 23 hours',NOW()-INTERVAL '59 days 21 hours 20 minutes',NOW()-INTERVAL '59 days 21 hours 15 minutes',NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-hs04-8','ro-hs04-8',82.40,12,0,7,'CONFIRMED',true,NOW()-INTERVAL '60 days',NOW()-INTERVAL '60 days');

-- ============================================================
-- EVENT 2: ACTIVE (LIVE #1) — Bryneven Winter Showjumping Festival 2026
-- Today, early in competition (SJ01 active with 2 done, 1 in arena)
-- ============================================================
INSERT INTO "Event" ("id", "name", "venue", "eventDate", "qualifier", "status", "createdAt", "updatedAt")
VALUES ('bryneven-winter-2026', 'Bryneven Winter Showjumping Festival 2026', 'Bryneven Equestrian Centre', '2026-06-20 08:00:00.000', 'SANESA Qualifier', 'ACTIVE', NOW(), NOW());

-- Arenas
INSERT INTO "Arena" ("id", "eventId", "name", "discipline", "status", "sortOrder", "createdAt", "updatedAt")
VALUES ('bw-arena-main', 'bryneven-winter-2026', 'Main Arena', 'SHOWJUMPING', 'ACTIVE', 1, NOW(), NOW());
INSERT INTO "Arena" ("id", "eventId", "name", "discipline", "status", "sortOrder", "createdAt", "updatedAt")
VALUES ('bw-arena-warmup', 'bryneven-winter-2026', 'Warmup Arena', 'SHOWJUMPING', 'ACTIVE', 2, NOW(), NOW());
INSERT INTO "Arena" ("id", "eventId", "name", "discipline", "status", "sortOrder", "createdAt", "updatedAt")
VALUES ('bw-arena-derby', 'bryneven-winter-2026', 'Derby Arena', 'SHOWJUMPING', 'ACTIVE', 3, NOW(), NOW());

-- Classes
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('bw-class-sj01','bryneven-winter-2026','bw-arena-main','SJ01','80cm Novice','SHOWJUMPING','80cm','A2 COMPETITION','08:00',10,1,'ACTIVE',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('bw-class-sj02','bryneven-winter-2026','bw-arena-main','SJ02','90cm Novice','SHOWJUMPING','90cm','A2 COMPETITION','09:00',10,2,'ACTIVE',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('bw-class-sj03','bryneven-winter-2026','bw-arena-warmup','SJ03','1.00m Open','SHOWJUMPING','100cm','2PHASE COMPETITION','10:30',10,3,'ACTIVE',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('bw-class-sj04','bryneven-winter-2026','bw-arena-warmup','SJ04','1.10m Open','SHOWJUMPING','110cm','2PHASE COMPETITION','11:30',10,4,'ACTIVE',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('bw-class-sj05','bryneven-winter-2026','bw-arena-derby','SJ05','1.20m Championship','SHOWJUMPING','120cm','CHAMPIONSHIP','13:00',10,5,'PENDING',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('bw-class-sj06','bryneven-winter-2026','bw-arena-derby','SJ06','Derby Championship','SHOWJUMPING','120cm','DERBY','14:30',10,6,'PENDING',NOW(),NOW());

-- SJ01: 2 finished, 1 in arena, 2 checked in, 5 scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj01-1','bw-class-sj01','rider-1','horse-1',1,'FINISHED',NOW()-INTERVAL '30 minutes',NOW()-INTERVAL '20 minutes',NOW()-INTERVAL '15 minutes',NOW(),NOW());
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('bwh-1','ro-bw-sj01-1','SCHEDULED','CHECKED_IN','Rider checked in','gate-marshal',NOW()-INTERVAL '30 minutes');
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('bwh-2','ro-bw-sj01-1','CHECKED_IN','IN_ARENA','Rider entered arena','gate-marshal',NOW()-INTERVAL '20 minutes');
INSERT INTO "TimerEvent" ("id","runningOrderId","eventType","source","capturedBy","eventTime") VALUES ('bwte-1','ro-bw-sj01-1','START','timer','demo-user',NOW()-INTERVAL '20 minutes');
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('bwh-3','ro-bw-sj01-1','IN_ARENA','FINISHED','Round complete','gate-marshal',NOW()-INTERVAL '15 minutes');
INSERT INTO "TimerEvent" ("id","runningOrderId","eventType","source","capturedBy","eventTime") VALUES ('bwte-2','ro-bw-sj01-1','FINISH','timer','demo-user',NOW()-INTERVAL '15 minutes');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-bw-sj01-1','ro-bw-sj01-1',58.23,0,0,1,'CONFIRMED',true,NOW(),NOW());

INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj01-2','bw-class-sj01','rider-2','horse-2',2,'FINISHED',NOW()-INTERVAL '25 minutes',NOW()-INTERVAL '12 minutes',NOW()-INTERVAL '7 minutes',NOW(),NOW());
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('bwh-4','ro-bw-sj01-2','SCHEDULED','CHECKED_IN','Rider checked in','gate-marshal',NOW()-INTERVAL '25 minutes');
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('bwh-5','ro-bw-sj01-2','CHECKED_IN','IN_ARENA','Rider entered arena','gate-marshal',NOW()-INTERVAL '12 minutes');
INSERT INTO "TimerEvent" ("id","runningOrderId","eventType","source","capturedBy","eventTime") VALUES ('bwte-3','ro-bw-sj01-2','START','timer','demo-user',NOW()-INTERVAL '12 minutes');
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('bwh-6','ro-bw-sj01-2','IN_ARENA','FINISHED','Round complete','gate-marshal',NOW()-INTERVAL '7 minutes');
INSERT INTO "TimerEvent" ("id","runningOrderId","eventType","source","capturedBy","eventTime") VALUES ('bwte-4','ro-bw-sj01-2','FINISH','timer','demo-user',NOW()-INTERVAL '7 minutes');
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-bw-sj01-2','ro-bw-sj01-2',61.12,4,0,2,'CONFIRMED',true,NOW(),NOW());

INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj01-3','bw-class-sj01','rider-3','horse-3',3,'IN_ARENA',NOW()-INTERVAL '10 minutes',NOW()-INTERVAL '3 minutes',NULL,NOW(),NOW());
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('bwh-7','ro-bw-sj01-3','SCHEDULED','CHECKED_IN','Rider checked in','gate-marshal',NOW()-INTERVAL '10 minutes');
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('bwh-8','ro-bw-sj01-3','CHECKED_IN','IN_ARENA','Rider entered arena','gate-marshal',NOW()-INTERVAL '3 minutes');
INSERT INTO "TimerEvent" ("id","runningOrderId","eventType","source","capturedBy","eventTime") VALUES ('bwte-5','ro-bw-sj01-3','START','timer','demo-user',NOW()-INTERVAL '3 minutes');

INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj01-4','bw-class-sj01','rider-4','horse-4',4,'CHECKED_IN',NOW()-INTERVAL '8 minutes',NULL,NULL,NOW(),NOW());
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('bwh-9','ro-bw-sj01-4','SCHEDULED','CHECKED_IN','Rider checked in','gate-marshal',NOW()-INTERVAL '8 minutes');

INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj01-5','bw-class-sj01','rider-5','horse-5',5,'CHECKED_IN',NOW()-INTERVAL '5 minutes',NULL,NULL,NOW(),NOW());
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('bwh-10','ro-bw-sj01-5','SCHEDULED','CHECKED_IN','Rider checked in','gate-marshal',NOW()-INTERVAL '5 minutes');

INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj01-6','bw-class-sj01','rider-6','horse-6',6,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj01-7','bw-class-sj01','rider-7','horse-7',7,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj01-8','bw-class-sj01','rider-8','horse-8',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj01-9','bw-class-sj01','rider-9','horse-9',9,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj01-10','bw-class-sj01','rider-10','horse-10',10,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- SJ02: all scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj02-1','bw-class-sj02','rider-11','horse-11',1,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj02-2','bw-class-sj02','rider-12','horse-12',2,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj02-3','bw-class-sj02','rider-13','horse-13',3,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj02-4','bw-class-sj02','rider-14','horse-14',4,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj02-5','bw-class-sj02','rider-15','horse-15',5,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj02-6','bw-class-sj02','rider-16','horse-16',6,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj02-7','bw-class-sj02','rider-17','horse-17',7,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj02-8','bw-class-sj02','rider-18','horse-18',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj02-9','bw-class-sj02','rider-19','horse-19',9,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj02-10','bw-class-sj02','rider-20','horse-20',10,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- SJ03: all scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj03-1','bw-class-sj03','rider-21','horse-21',1,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj03-2','bw-class-sj03','rider-22','horse-22',2,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj03-3','bw-class-sj03','rider-23','horse-23',3,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj03-4','bw-class-sj03','rider-24','horse-24',4,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj03-5','bw-class-sj03','rider-25','horse-25',5,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj03-6','bw-class-sj03','rider-26','horse-26',6,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj03-7','bw-class-sj03','rider-27','horse-27',7,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj03-8','bw-class-sj03','rider-28','horse-28',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj03-9','bw-class-sj03','rider-29','horse-29',9,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj03-10','bw-class-sj03','rider-30','horse-30',10,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- SJ04: all scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj04-1','bw-class-sj04','rider-31','horse-31',1,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj04-2','bw-class-sj04','rider-32','horse-32',2,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj04-3','bw-class-sj04','rider-33','horse-33',3,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj04-4','bw-class-sj04','rider-34','horse-34',4,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj04-5','bw-class-sj04','rider-35','horse-35',5,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj04-6','bw-class-sj04','rider-36','horse-36',6,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj04-7','bw-class-sj04','rider-37','horse-37',7,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj04-8','bw-class-sj04','rider-38','horse-38',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj04-9','bw-class-sj04','rider-39','horse-39',9,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-bw-sj04-10','bw-class-sj04','rider-40','horse-40',10,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- ============================================================
-- EVENT 3: ACTIVE (LIVE #2) — Kyalami Autumn Challenge 2026
-- Further along: KA01 has 5 finished, 1 in arena. KA02 has 2 finished.
-- ============================================================
INSERT INTO "Event" ("id", "name", "venue", "eventDate", "qualifier", "status", "createdAt", "updatedAt")
VALUES ('kyalami-autumn-2026', 'Kyalami Autumn Challenge 2026', 'Kyalami Equestrian Estate', '2026-06-20 07:00:00.000', 'SANESA Qualifier', 'ACTIVE', NOW(), NOW());

-- Arenas
INSERT INTO "Arena" ("id", "eventId", "name", "discipline", "status", "sortOrder", "createdAt", "updatedAt")
VALUES ('ka-arena-grand', 'kyalami-autumn-2026', 'Grand Prix Arena', 'SHOWJUMPING', 'ACTIVE', 1, NOW(), NOW());
INSERT INTO "Arena" ("id", "eventId", "name", "discipline", "status", "sortOrder", "createdAt", "updatedAt")
VALUES ('ka-arena-practice', 'kyalami-autumn-2026', 'Practice Arena', 'SHOWJUMPING', 'ACTIVE', 2, NOW(), NOW());

-- Classes
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('ka-class-1','kyalami-autumn-2026','ka-arena-grand','KA01','85cm Novice','SHOWJUMPING','85cm','A2 COMPETITION','07:00',8,1,'ACTIVE',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('ka-class-2','kyalami-autumn-2026','ka-arena-grand','KA02','1.05m Open','SHOWJUMPING','105cm','2PHASE COMPETITION','09:00',8,2,'ACTIVE',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('ka-class-3','kyalami-autumn-2026','ka-arena-practice','KA03','1.15m Grand Prix','SHOWJUMPING','115cm','CHAMPIONSHIP','11:30',8,3,'PENDING',NOW(),NOW());

-- KA01: 5 finished, 1 in arena, 1 checked in, 1 scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka01-1','ka-class-1','rider-41','horse-41',1,'FINISHED',NOW()-INTERVAL '90 minutes',NOW()-INTERVAL '80 minutes',NOW()-INTERVAL '75 minutes',NOW(),NOW());
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-ka01-1','ro-ka01-1',54.88,0,0,1,'CONFIRMED',true,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka01-2','ka-class-1','rider-42','horse-42',2,'FINISHED',NOW()-INTERVAL '80 minutes',NOW()-INTERVAL '70 minutes',NOW()-INTERVAL '65 minutes',NOW(),NOW());
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-ka01-2','ro-ka01-2',57.22,0,0,2,'CONFIRMED',true,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka01-3','ka-class-1','rider-43','horse-43',3,'FINISHED',NOW()-INTERVAL '70 minutes',NOW()-INTERVAL '60 minutes',NOW()-INTERVAL '55 minutes',NOW(),NOW());
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-ka01-3','ro-ka01-3',63.41,4,0,3,'CONFIRMED',true,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka01-4','ka-class-1','rider-44','horse-44',4,'FINISHED',NOW()-INTERVAL '60 minutes',NOW()-INTERVAL '50 minutes',NOW()-INTERVAL '45 minutes',NOW(),NOW());
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-ka01-4','ro-ka01-4',71.05,8,0,4,'CONFIRMED',true,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka01-5','ka-class-1','rider-45','horse-45',5,'FINISHED',NOW()-INTERVAL '50 minutes',NOW()-INTERVAL '40 minutes',NOW()-INTERVAL '35 minutes',NOW(),NOW());
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-ka01-5','ro-ka01-5',52.33,0,0,1,'CONFIRMED',true,NOW(),NOW());

INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka01-6','ka-class-1','rider-46','horse-46',6,'IN_ARENA',NOW()-INTERVAL '20 minutes',NOW()-INTERVAL '5 minutes',NULL,NOW(),NOW());
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('kah-1','ro-ka01-6','SCHEDULED','CHECKED_IN','Rider checked in','gate-marshal',NOW()-INTERVAL '20 minutes');
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('kah-2','ro-ka01-6','CHECKED_IN','IN_ARENA','Rider entered arena','gate-marshal',NOW()-INTERVAL '5 minutes');
INSERT INTO "TimerEvent" ("id","runningOrderId","eventType","source","capturedBy","eventTime") VALUES ('kate-1','ro-ka01-6','START','timer','demo-user',NOW()-INTERVAL '5 minutes');

INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka01-7','ka-class-1','rider-47','horse-47',7,'CHECKED_IN',NOW()-INTERVAL '10 minutes',NULL,NULL,NOW(),NOW());
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('kah-3','ro-ka01-7','SCHEDULED','CHECKED_IN','Rider checked in','gate-marshal',NOW()-INTERVAL '10 minutes');

INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka01-8','ka-class-1','rider-48','horse-48',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- KA02: 2 finished, 1 in arena, 5 scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka02-1','ka-class-2','rider-33','horse-33',1,'FINISHED',NOW()-INTERVAL '45 minutes',NOW()-INTERVAL '35 minutes',NOW()-INTERVAL '30 minutes',NOW(),NOW());
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-ka02-1','ro-ka02-1',67.90,0,0,1,'CONFIRMED',true,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka02-2','ka-class-2','rider-34','horse-34',2,'FINISHED',NOW()-INTERVAL '35 minutes',NOW()-INTERVAL '25 minutes',NOW()-INTERVAL '20 minutes',NOW(),NOW());
INSERT INTO "Result" ("id","runningOrderId","elapsedSeconds","faults","penalties","placing","resultStatus","published","createdAt","updatedAt") VALUES ('res-ka02-2','ro-ka02-2',72.15,4,0,2,'CONFIRMED',true,NOW(),NOW());

INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka02-3','ka-class-2','rider-35','horse-35',3,'IN_ARENA',NOW()-INTERVAL '15 minutes',NOW()-INTERVAL '4 minutes',NULL,NOW(),NOW());
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('kah-4','ro-ka02-3','SCHEDULED','CHECKED_IN','Rider checked in','gate-marshal',NOW()-INTERVAL '15 minutes');
INSERT INTO "StatusHistory" ("id","runningOrderId","oldStatus","newStatus","reason","changedBy","changedAt") VALUES ('kah-5','ro-ka02-3','CHECKED_IN','IN_ARENA','Rider entered arena','gate-marshal',NOW()-INTERVAL '4 minutes');
INSERT INTO "TimerEvent" ("id","runningOrderId","eventType","source","capturedBy","eventTime") VALUES ('kate-2','ro-ka02-3','START','timer','demo-user',NOW()-INTERVAL '4 minutes');

INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka02-4','ka-class-2','rider-36','horse-36',4,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka02-5','ka-class-2','rider-37','horse-37',5,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka02-6','ka-class-2','rider-38','horse-38',6,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka02-7','ka-class-2','rider-39','horse-39',7,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka02-8','ka-class-2','rider-40','horse-40',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- KA03: all scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka03-1','ka-class-3','rider-49','horse-49',1,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka03-2','ka-class-3','rider-50','horse-50',2,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka03-3','ka-class-3','rider-1','horse-41',3,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka03-4','ka-class-3','rider-2','horse-42',4,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka03-5','ka-class-3','rider-3','horse-43',5,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka03-6','ka-class-3','rider-4','horse-44',6,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka03-7','ka-class-3','rider-5','horse-45',7,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ka03-8','ka-class-3','rider-6','horse-46',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- ============================================================
-- EVENT 4: UPCOMING — Sandton Summer Series 2026 (August 2026)
-- Fully configured, all running orders pre-scheduled, no activity
-- ============================================================
INSERT INTO "Event" ("id", "name", "venue", "eventDate", "qualifier", "status", "createdAt", "updatedAt")
VALUES ('sandton-summer-2026', 'Sandton Summer Series 2026', 'Sandton Equestrian Club', '2026-08-15 08:00:00.000', 'SANESA Qualifier', 'UPCOMING', NOW(), NOW());

-- Arenas
INSERT INTO "Arena" ("id", "eventId", "name", "discipline", "status", "sortOrder", "createdAt", "updatedAt")
VALUES ('ss-arena-1', 'sandton-summer-2026', 'Show Arena', 'SHOWJUMPING', 'ACTIVE', 1, NOW(), NOW());
INSERT INTO "Arena" ("id", "eventId", "name", "discipline", "status", "sortOrder", "createdAt", "updatedAt")
VALUES ('ss-arena-2', 'sandton-summer-2026', 'Training Arena', 'SHOWJUMPING', 'ACTIVE', 2, NOW(), NOW());

-- Classes (all PENDING)
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('ss-class-1','sandton-summer-2026','ss-arena-1','SS01','70cm Grassroots','SHOWJUMPING','70cm','A2 COMPETITION','08:00',12,1,'PENDING',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('ss-class-2','sandton-summer-2026','ss-arena-1','SS02','80cm Novice','SHOWJUMPING','80cm','A2 COMPETITION','09:30',12,2,'PENDING',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('ss-class-3','sandton-summer-2026','ss-arena-1','SS03','90cm Junior','SHOWJUMPING','90cm','A2 COMPETITION','11:00',12,3,'PENDING',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('ss-class-4','sandton-summer-2026','ss-arena-2','SS04','1.00m Open','SHOWJUMPING','100cm','2PHASE COMPETITION','08:30',10,4,'PENDING',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('ss-class-5','sandton-summer-2026','ss-arena-2','SS05','1.10m Open','SHOWJUMPING','110cm','2PHASE COMPETITION','10:30',10,5,'PENDING',NOW(),NOW());
INSERT INTO "CompetitionClass" ("id","eventId","arenaId","classCode","name","discipline","height","competitionType","scheduledStartTime","expectedRiders","sortOrder","status","createdAt","updatedAt")
VALUES ('ss-class-6','sandton-summer-2026','ss-arena-2','SS06','1.20m Classic','SHOWJUMPING','120cm','CHAMPIONSHIP','13:00',8,6,'PENDING',NOW(),NOW());

-- SS01: 10 riders all scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss01-1','ss-class-1','rider-1','horse-1',1,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss01-2','ss-class-1','rider-2','horse-2',2,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss01-3','ss-class-1','rider-3','horse-3',3,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss01-4','ss-class-1','rider-4','horse-4',4,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss01-5','ss-class-1','rider-5','horse-5',5,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss01-6','ss-class-1','rider-6','horse-6',6,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss01-7','ss-class-1','rider-7','horse-7',7,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss01-8','ss-class-1','rider-8','horse-8',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss01-9','ss-class-1','rider-9','horse-9',9,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss01-10','ss-class-1','rider-10','horse-10',10,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- SS02: 10 riders all scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss02-1','ss-class-2','rider-11','horse-11',1,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss02-2','ss-class-2','rider-12','horse-12',2,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss02-3','ss-class-2','rider-13','horse-13',3,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss02-4','ss-class-2','rider-14','horse-14',4,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss02-5','ss-class-2','rider-15','horse-15',5,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss02-6','ss-class-2','rider-16','horse-16',6,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss02-7','ss-class-2','rider-17','horse-17',7,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss02-8','ss-class-2','rider-18','horse-18',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss02-9','ss-class-2','rider-19','horse-19',9,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss02-10','ss-class-2','rider-20','horse-20',10,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- SS04: 8 riders all scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss04-1','ss-class-4','rider-25','horse-25',1,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss04-2','ss-class-4','rider-26','horse-26',2,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss04-3','ss-class-4','rider-27','horse-27',3,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss04-4','ss-class-4','rider-28','horse-28',4,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss04-5','ss-class-4','rider-29','horse-29',5,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss04-6','ss-class-4','rider-30','horse-30',6,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss04-7','ss-class-4','rider-31','horse-31',7,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss04-8','ss-class-4','rider-32','horse-32',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- SS06 Championship: 8 riders all scheduled
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss06-1','ss-class-6','rider-41','horse-41',1,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss06-2','ss-class-6','rider-42','horse-42',2,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss06-3','ss-class-6','rider-43','horse-43',3,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss06-4','ss-class-6','rider-44','horse-44',4,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss06-5','ss-class-6','rider-45','horse-45',5,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss06-6','ss-class-6','rider-46','horse-46',6,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss06-7','ss-class-6','rider-47','horse-47',7,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());
INSERT INTO "RunningOrder" ("id","classId","riderId","horseId","plannedOrderNo","status","checkedInAt","startedAt","finishedAt","createdAt","updatedAt") VALUES ('ro-ss06-8','ss-class-6','rider-48','horse-48',8,'SCHEDULED',NULL,NULL,NULL,NOW(),NOW());

-- ============================================================
-- END OF SEED
-- ============================================================