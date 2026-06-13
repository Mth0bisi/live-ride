import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱  Starting database seeding...')

  // 1. Clear existing demo data
  console.log('🧹  Cleaning up existing data...')
  await prisma.timerEvent.deleteMany()
  await prisma.statusHistory.deleteMany()
  await prisma.result.deleteMany()
  await prisma.runningOrder.deleteMany()
  await prisma.competitionClass.deleteMany()
  await prisma.arena.deleteMany()
  await prisma.event.deleteMany()
  await prisma.rider.deleteMany()
  await prisma.horse.deleteMany()
  await prisma.school.deleteMany()

  // 2. Seed Event
  console.log('📅  Seeding Event...')
  const event = await prisma.event.upsert({
    where: { id: 'bryneven-winter-2026' },
    update: {},
    create: {
      id: 'bryneven-winter-2026',
      name: 'Bryneven Winter Showjumping Festival 2026',
      venue: 'Bryneven Equestrian Centre',
      eventDate: new Date('2026-06-20T08:00:00Z'),
      qualifier: 'SANESA Qualifier',
      status: 'ACTIVE',
    },
  })

  // 3. Seed Arenas
  console.log('🏟️  Seeding Arenas...')
  const mainArena = await prisma.arena.upsert({
    where: { id: 'arena-main' },
    update: {},
    create: {
      id: 'arena-main',
      eventId: event.id,
      name: 'Main Arena',
      discipline: 'SHOWJUMPING',
      status: 'ACTIVE',
      sortOrder: 1,
    },
  })

  const warmupArena = await prisma.arena.upsert({
    where: { id: 'arena-warmup' },
    update: {},
    create: {
      id: 'arena-warmup',
      eventId: event.id,
      name: 'Warmup Arena',
      discipline: 'SHOWJUMPING',
      status: 'ACTIVE',
      sortOrder: 2,
    },
  })

  const derbyArena = await prisma.arena.upsert({
    where: { id: 'arena-derby' },
    update: {},
    create: {
      id: 'arena-derby',
      eventId: event.id,
      name: 'Derby Arena',
      discipline: 'SHOWJUMPING',
      status: 'ACTIVE',
      sortOrder: 3,
    },
  })

  // 4. Seed Competition Classes
  console.log('🏆  Seeding Competition Classes...')
  const classSJ01 = await prisma.competitionClass.upsert({
    where: { eventId_classCode: { eventId: event.id, classCode: 'SJ01' } },
    update: {},
    create: {
      id: 'class-sj01',
      eventId: event.id,
      arenaId: mainArena.id,
      classCode: 'SJ01',
      name: '80cm Novice',
      discipline: 'SHOWJUMPING',
      height: '80cm',
      competitionType: 'A2 COMPETITION',
      scheduledStartTime: '08:00',
      expectedRiders: 10,
      sortOrder: 1,
      status: 'ACTIVE',
    },
  })

  const classSJ02 = await prisma.competitionClass.upsert({
    where: { eventId_classCode: { eventId: event.id, classCode: 'SJ02' } },
    update: {},
    create: {
      id: 'class-sj02',
      eventId: event.id,
      arenaId: mainArena.id,
      classCode: 'SJ02',
      name: '90cm Novice',
      discipline: 'SHOWJUMPING',
      height: '90cm',
      competitionType: 'A2 COMPETITION',
      scheduledStartTime: '09:00',
      expectedRiders: 10,
      sortOrder: 2,
      status: 'ACTIVE',
    },
  })

  const classSJ03 = await prisma.competitionClass.upsert({
    where: { eventId_classCode: { eventId: event.id, classCode: 'SJ03' } },
    update: {},
    create: {
      id: 'class-sj03',
      eventId: event.id,
      arenaId: warmupArena.id,
      classCode: 'SJ03',
      name: '1.00m Open',
      discipline: 'SHOWJUMPING',
      height: '100cm',
      competitionType: '2PHASE COMPETITION',
      scheduledStartTime: '10:30',
      expectedRiders: 10,
      sortOrder: 3,
      status: 'ACTIVE', // mix request: first 2 ACTIVE, next 2 IN_PROGRESS (we map IN_PROGRESS classes as ACTIVE in Prisma status string for UI compatibility)
    },
  })

  const classSJ04 = await prisma.competitionClass.upsert({
    where: { eventId_classCode: { eventId: event.id, classCode: 'SJ04' } },
    update: {},
    create: {
      id: 'class-sj04',
      eventId: event.id,
      arenaId: warmupArena.id,
      classCode: 'SJ04',
      name: '1.10m Open',
      discipline: 'SHOWJUMPING',
      height: '110cm',
      competitionType: '2PHASE COMPETITION',
      scheduledStartTime: '11:30',
      expectedRiders: 10,
      sortOrder: 4,
      status: 'ACTIVE', // mix request: next 2 IN_PROGRESS
    },
  })

  const classSJ05 = await prisma.competitionClass.upsert({
    where: { eventId_classCode: { eventId: event.id, classCode: 'SJ05' } },
    update: {},
    create: {
      id: 'class-sj05',
      eventId: event.id,
      arenaId: derbyArena.id,
      classCode: 'SJ05',
      name: '1.20m Championship',
      discipline: 'SHOWJUMPING',
      height: '120cm',
      competitionType: 'CHAMPIONSHIP',
      scheduledStartTime: '13:00',
      expectedRiders: 0,
      sortOrder: 5,
      status: 'PENDING', // mix request: last 2 PENDING
    },
  })

  const classSJ06 = await prisma.competitionClass.upsert({
    where: { eventId_classCode: { eventId: event.id, classCode: 'SJ06' } },
    update: {},
    create: {
      id: 'class-sj06',
      eventId: event.id,
      arenaId: derbyArena.id,
      classCode: 'SJ06',
      name: 'Derby Championship',
      discipline: 'SHOWJUMPING',
      height: '120cm',
      competitionType: 'DERBY',
      scheduledStartTime: '14:30',
      expectedRiders: 0,
      sortOrder: 6,
      status: 'PENDING', // mix request: last 2 PENDING
    },
  })

  // 5. Seed Schools
  console.log('🏫  Seeding Schools...')
  const schoolNames = [
    'Bryneven Primary',
    'Crawford Sandton',
    'Redhill School',
    'St Stithians',
    'King David',
  ]
  const schools = []
  for (const name of schoolNames) {
    const school = await prisma.school.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    schools.push(school)
  }

  // 6. Seed Riders (40 Riders)
  console.log('👤  Seeding Riders...')
  const riderFirstNames = [
    'Emma', 'Liam', 'Ava', 'Noah', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James',
    'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Alexander', 'Evelyn', 'Michael', 'Abigail', 'Daniel',
    'Emily', 'Jacob', 'Elizabeth', 'Logan', 'Sofia', 'Jackson', 'Avery', 'Sebastian', 'Ella', 'Jack',
    'Madison', 'Aiden', 'Scarlett', 'Owen', 'Victoria', 'Samuel', 'Aria', 'Matthew', 'Grace', 'Henry'
  ]
  const riderLastNames = [
    'Smith', 'Brown', 'Johnson', 'Williams', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez',
    'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez',
    'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young',
    'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Carter', 'Mitchell'
  ]

  const riders = []
  for (let i = 0; i < 40; i++) {
    const riderNo = `R${(i + 1).toString().padStart(3, '0')}`
    const fullName = `${riderFirstNames[i]} ${riderLastNames[i]}`
    const schoolIndex = Math.floor(i / 8) // Distribute evenly (8 per school)
    const schoolId = schools[schoolIndex].id

    const rider = await prisma.rider.upsert({
      where: { riderNo },
      update: { fullName, schoolId },
      create: { riderNo, fullName, schoolId },
    })
    riders.push(rider)
  }

  // 7. Seed Horses (40 Horses)
  console.log('🐴  Seeding Horses...')
  const horseNames = [
    'Thunder', 'Apollo', 'Shadow', 'Spirit', 'Storm', 'Majestic', 'Titan', 'Blaze', 'Silver', 'Comet',
    'Eclipse', 'Phantom', 'Midnight', 'Goldie', 'Star', 'Pegasus', 'Trigger', 'Rusty', 'Duchess', 'Bella',
    'Zorro', 'Cavalier', 'Whisper', 'Goliath', 'Destiny', 'Arrow', 'Ranger', 'Legacy', 'Justice', 'Zephyr',
    'Pioneer', 'Liberty', 'Sentinel', 'Tornado', 'Wildfire', 'Starlight', 'Sterling', 'Valiant', 'Outlaw', 'Legend'
  ]
  const horses = []
  for (const name of horseNames) {
    const horse = await prisma.horse.upsert({
      where: { name },
      update: {},
      create: { name, type: 'HORSE' },
    })
    horses.push(horse)
  }

  // 8. Seed Running Orders & Results & Status History & Timer Events
  console.log('🏃  Seeding Running Orders & Results...')
  const classesToSeed = [classSJ01, classSJ02, classSJ03, classSJ04]
  let riderOffset = 0

  const resultsToCreate = [
    { elapsedSeconds: 58.23, faults: 0, penalties: 0, placing: 1 },
    { elapsedSeconds: 61.12, faults: 4, penalties: 0, placing: 2 }
  ]

  for (const cc of classesToSeed) {
    console.log(`   Seeding entries for class ${cc.classCode} (${cc.name})...`)
    
    // Distribute 10 riders for this class
    for (let plannedOrderNo = 1; plannedOrderNo <= 10; plannedOrderNo++) {
      const riderIndex = riderOffset + (plannedOrderNo - 1)
      const rider = riders[riderIndex]
      const horse = horses[riderIndex]

      // Status Distribution: 2 COMPLETED (FINISHED), 1 RIDING (IN_ARENA), 2 CHECKED_IN, 5 SCHEDULED
      let status = 'SCHEDULED'
      if (plannedOrderNo === 1 || plannedOrderNo === 2) {
        status = 'FINISHED'
      } else if (plannedOrderNo === 3) {
        status = 'IN_ARENA'
      } else if (plannedOrderNo === 4 || plannedOrderNo === 5) {
        status = 'CHECKED_IN'
      }

      const hasResult = status === 'FINISHED'
      
      const ro = await prisma.runningOrder.create({
        data: {
          classId: cc.id,
          riderId: rider.id,
          horseId: horse.id,
          plannedOrderNo,
          status,
          checkedInAt: status !== 'SCHEDULED' ? new Date(Date.now() - 30 * 60 * 1000) : null,
          startedAt: hasResult || status === 'IN_ARENA' ? new Date(Date.now() - 10 * 60 * 1000) : null,
          finishedAt: hasResult ? new Date(Date.now() - 5 * 60 * 1000) : null,
        },
      })

      // Status history records showing progression
      if (status !== 'SCHEDULED') {
        await prisma.statusHistory.create({
          data: {
            runningOrderId: ro.id,
            oldStatus: 'SCHEDULED',
            newStatus: 'CHECKED_IN',
            reason: 'Rider checked in',
            changedBy: 'system-demo',
          }
        })
      }

      if (status === 'IN_ARENA' || hasResult) {
        await prisma.statusHistory.create({
          data: {
            runningOrderId: ro.id,
            oldStatus: 'CHECKED_IN',
            newStatus: 'IN_ARENA',
            reason: 'Rider entered the arena',
            changedBy: 'system-demo',
          }
        })

        // Timer event START
        await prisma.timerEvent.create({
          data: {
            runningOrderId: ro.id,
            eventType: 'START',
            source: 'timer',
            capturedBy: 'demo-user',
          }
        })
      }

      if (hasResult) {
        await prisma.statusHistory.create({
          data: {
            runningOrderId: ro.id,
            oldStatus: 'IN_ARENA',
            newStatus: 'FINISHED',
            reason: 'Round finished successfully',
            changedBy: 'system-demo',
          }
        })

        // Timer event FINISH
        await prisma.timerEvent.create({
          data: {
            runningOrderId: ro.id,
            eventType: 'FINISH',
            source: 'timer',
            capturedBy: 'demo-user',
          }
        })

        // Result record
        const resData = resultsToCreate[plannedOrderNo - 1]
        await prisma.result.create({
          data: {
            runningOrderId: ro.id,
            elapsedSeconds: resData.elapsedSeconds,
            faults: resData.faults,
            penalties: resData.penalties,
            placing: resData.placing,
            resultStatus: 'CONFIRMED', // CONFIRMED matches FINAL
            published: true,
          }
        })
      }
    }

    // Move to next set of 10 riders for next class
    riderOffset += 10
  }

  console.log('✅  Seeding complete! Everything is configured.')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
