/**
 * LiveRide Show Platform — Demo Seed
 *
 * Generates a believable SANESA Ekurhuleni Qualifier with:
 *   • 1 event
 *   • 3 arenas (Peter Minnie, May Foxcroft, Small Sand)
 *   • 6 competition classes spread across the arenas
 *   • 15 schools, 20 riders, 22 horses
 *   • 32 running order entries
 *   • 9 riders appearing in 2 or more classes (cross-class entries)
 *   • Pre-seeded results & status history for the first 8 riders
 *     so the public dashboard looks "live" from the first page load
 *   • Arena rake and course change examples baked in
 *
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function upsertSchool(name: string) {
  return prisma.school.upsert({ where: { name }, update: {}, create: { name } })
}

async function upsertHorse(name: string, type: 'HORSE' | 'PONY') {
  return prisma.horse.upsert({ where: { name }, update: { type }, create: { name, type } })
}

async function upsertRider(riderNo: string, fullName: string, schoolId: string) {
  return prisma.rider.upsert({
    where:  { riderNo },
    update: { fullName, schoolId },
    create: { riderNo, fullName, schoolId },
  })
}

/**
 * Create a running order entry.
 * If `result` is provided the entry is pre-seeded as a completed round
 * with a Result record and a StatusHistory audit trail.
 */
async function createEntry(opts: {
  classId:       string
  riderId:       string
  horseId:       string
  plannedOrderNo: number
  plannedTime?:  string
  notes?:        string
  result?: {
    elapsedSeconds: number
    faults:         number
    status:         'FINISHED' | 'ELIMINATED' | 'RETIRED'
    confirmed?:     boolean   // default: true
  }
}) {
  const hasResult = !!opts.result
  const confirmed = opts.result?.confirmed !== false

  const ro = await prisma.runningOrder.create({
    data: {
      classId:        opts.classId,
      riderId:        opts.riderId,
      horseId:        opts.horseId,
      plannedOrderNo: opts.plannedOrderNo,
      plannedTime:    opts.plannedTime ?? null,
      notes:          opts.notes ?? null,
      status:         hasResult ? (confirmed ? 'RESULT_CONFIRMED' : opts.result!.status) : 'SCHEDULED',
      checkedInAt:    hasResult ? new Date() : null,
      startedAt:      hasResult ? new Date() : null,
      finishedAt:     hasResult ? new Date() : null,
    },
  })

  if (opts.result) {
    // Result record
    await prisma.result.create({
      data: {
        runningOrderId: ro.id,
        elapsedSeconds: opts.result.elapsedSeconds,
        faults:         opts.result.faults,
        resultStatus:   confirmed ? 'CONFIRMED' : 'PENDING',
        published:      confirmed,
      },
    })

    // Audit trail — use individual creates without a custom timestamp
    // (changedAt defaults to now() which is correct for demo purposes)
    await prisma.statusHistory.create({ data: {
      runningOrderId: ro.id,
      oldStatus: 'SCHEDULED',
      newStatus: 'CHECKED_IN',
      reason: 'Rider arrived at gate',
      changedBy: 'Gate Marshal',
    }})
    await prisma.statusHistory.create({ data: {
      runningOrderId: ro.id,
      oldStatus: 'CHECKED_IN',
      newStatus: 'AT_GATE',
      reason: 'Rider at gate, ready to enter',
      changedBy: 'Gate Marshal',
    }})
    await prisma.statusHistory.create({ data: {
      runningOrderId: ro.id,
      oldStatus: 'AT_GATE',
      newStatus: 'IN_ARENA',
      reason: 'Round started',
      changedBy: 'Timer 1',
    }})
    await prisma.statusHistory.create({ data: {
      runningOrderId: ro.id,
      oldStatus: 'IN_ARENA',
      newStatus: opts.result.status,
      reason: `Round finished — status: ${opts.result.status}`,
      changedBy: 'Timer 1',
    }})
    if (confirmed) {
      await prisma.statusHistory.create({ data: {
        runningOrderId: ro.id,
        oldStatus: opts.result.status,
        newStatus: 'RESULT_CONFIRMED',
        reason: 'Result confirmed by judge',
        changedBy: 'Judge 1',
      }})
    }

    // Timer events
    await prisma.timerEvent.create({ data: {
      runningOrderId: ro.id,
      eventType: 'START',
      capturedBy: 'Timer 1',
      source: 'MANUAL',
    }})
    await prisma.timerEvent.create({ data: {
      runningOrderId: ro.id,
      eventType: 'FINISH',
      capturedBy: 'Timer 1',
      source: 'MANUAL',
    }})
  }

  return ro
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Seeding LiveRide demo data…')

  // ── 1. Schools ──────────────────────────────────────────────────────────────
  console.log('   Creating schools…')

  const [
    ashton, stDominic, stMarys, dainfern, beaulieu,
    brescia, jansen, eldoraigne, helpmekaar, sasolburg,
    crawfordSandton, highbury, crossroads, kloof, rhenish,
  ] = await Promise.all([
    upsertSchool('Ashton International College'),
    upsertSchool("St. Dominic's School"),
    upsertSchool("St Mary's School, Waverley High"),
    upsertSchool('Dainfern College'),
    upsertSchool('Beaulieu College'),
    upsertSchool('Brescia House High School'),
    upsertSchool('Hoërskool Dr E G Jansen'),
    upsertSchool('Hoërskool Eldoraigne'),
    upsertSchool('Helpmekaar Kollege'),
    upsertSchool('Sasolburg High School'),
    upsertSchool('Crawford College Sandton'),
    upsertSchool('Highbury Preparatory School'),
    upsertSchool('Crossroads Academy'),
    upsertSchool('Kloof High School'),
    upsertSchool('Rhenish Girls High School'),
  ])

  // ── 2. Horses ───────────────────────────────────────────────────────────────
  console.log('   Creating horses…')

  const [
    redSquare, atlantic, pegasus, royalFavour, midnightZidi,
    zeidasDream, callahoLarlue, joyField, heartOfCaesour, farHills,
    missDaisy, aandag, caramelito, siberianPunch, blueOcean,
    fireDancer, goldRush, shadowPeak, starlight, quantumLeap,
    silverbell, lazyHazel,
  ] = await Promise.all([
    upsertHorse('Sunny Park Cs Red Square', 'PONY'),
    upsertHorse('Atlantic', 'PONY'),
    upsertHorse('Pegasus Supernova', 'PONY'),
    upsertHorse('Royal Favour', 'PONY'),
    upsertHorse('Midnight Zidi', 'PONY'),
    upsertHorse('Zeidas Dream', 'HORSE'),
    upsertHorse('Callaho Larlue', 'HORSE'),
    upsertHorse('Joy Field', 'HORSE'),
    upsertHorse('Heart of Caesour', 'HORSE'),
    upsertHorse("FAR HILLS PINTADO JE'TAIME", 'HORSE'),
    upsertHorse('Miss Daisy', 'PONY'),
    upsertHorse('Aandag Bospols', 'PONY'),
    upsertHorse('Caramelito VH', 'PONY'),
    upsertHorse('Siberian Punch', 'HORSE'),
    upsertHorse('Blue Ocean', 'HORSE'),
    upsertHorse('Fire Dancer', 'HORSE'),
    upsertHorse('Gold Rush D', 'PONY'),
    upsertHorse('Shadow Peak', 'HORSE'),
    upsertHorse('Starlight Express', 'PONY'),
    upsertHorse('Quantum Leap', 'HORSE'),
    upsertHorse('Silverbell', 'PONY'),
    upsertHorse('Lazy Hazel', 'PONY'),
  ])

  // ── 3. Riders ───────────────────────────────────────────────────────────────
  console.log('   Creating riders…')

  // Note: jaimie (GP11943) competes in BOTH pony (redSquare) and horse (callahoLarlue) classes
  //       hannah (GP11406) competes in horse 110 AND 90cm classes with different horses
  //       kylie  (GP10408) competes in horse 110 AND 90cm classes with different horses
  //       Cross-class entries are a core SANESA feature this seed demonstrates
  const [
    jaimie, trinity, astrid, shelly, micaela,
    hannah, isabella, marise, kylie, kirsten,
    arlia, lena, chloe, amber, zara,
    grace, sophie, nadia, jessica, emma,
  ] = await Promise.all([
    upsertRider('GP11943', 'Jaimie Riley',         ashton.id),
    upsertRider('GP93786', 'Trinity Swart',         stDominic.id),
    upsertRider('GP14725', 'Astrid Blair',          stMarys.id),
    upsertRider('GP16689', 'Shelly Xilei Zheng',   stMarys.id),
    upsertRider('GP15798', 'Micaela Simpson',       dainfern.id),
    upsertRider('GP11406', 'Hannah Harrison',       beaulieu.id),
    upsertRider('GP14442', 'Isabella Band',         brescia.id),
    upsertRider('GP14909', 'Marise Helberg',        jansen.id),
    upsertRider('GP10408', 'Kylie de Jager',        eldoraigne.id),
    upsertRider('GP43792', 'Kirsten Vorster',       helpmekaar.id),
    upsertRider('FS93839', 'Arlia Gouws',           sasolburg.id),
    upsertRider('GP22341', 'Lena van der Berg',     crawfordSandton.id),
    upsertRider('GP33128', 'Chloe Nkosi',           highbury.id),
    upsertRider('GP41055', 'Amber Fourie',          crossroads.id),
    upsertRider('GP50291', 'Zara Pietersen',        kloof.id),
    upsertRider('GP61748', 'Grace Strydom',         rhenish.id),
    upsertRider('GP72836', 'Sophie Dlamini',        dainfern.id),
    upsertRider('GP83947', 'Nadia Botha',           beaulieu.id),
    upsertRider('GP91023', 'Jessica Steyn',         stMarys.id),
    upsertRider('GP17645', 'Emma van Rooyen',       ashton.id),
  ])

  // ── 4. Events ────────────────────────────────────────────────────────────────
  console.log('   Creating events…')

  const event = await prisma.event.upsert({
    where:  { id: 'sanesa-ekurhuleni-q3-2026' },
    update: { eventDate: new Date('2026-06-07T08:00:00.000Z'), status: 'ACTIVE' },
    create: {
      id:        'sanesa-ekurhuleni-q3-2026',
      name:      'SANESA Ekurhuleni Qualifier 3',
      eventDate: new Date('2026-06-07T08:00:00.000Z'),
      venue:     'Kyalami Park Club',
      qualifier: 'Q3',
      status:    'ACTIVE',
    },
  })

  const event2 = await prisma.event.upsert({
    where:  { id: 'sanesa-gauteng-champs-2026' },
    update: {},
    create: {
      id:        'sanesa-gauteng-champs-2026',
      name:      'SANESA Gauteng Championships',
      eventDate: new Date('2026-07-12T08:00:00.000Z'),
      venue:     'Mistico Equestrian Centre',
      qualifier: 'Championships',
      status:    'UPCOMING',
    },
  })

  const event3 = await prisma.event.upsert({
    where:  { id: 'sanesa-ekurhuleni-q2-2026' },
    update: {},
    create: {
      id:        'sanesa-ekurhuleni-q2-2026',
      name:      'SANESA Ekurhuleni Qualifier 2',
      eventDate: new Date('2026-05-10T08:00:00.000Z'),
      venue:     'Shongweni Club',
      qualifier: 'Q2',
      status:    'COMPLETE',
    },
  })

  // ── 5. Arenas ────────────────────────────────────────────────────────────────
  console.log('   Creating arenas…')

  // Peter Minnie = ACTIVE (first class busy)
  // May Foxcroft = ARENA_RAKE (between classes — gives a realistic status example)
  // Small Sand   = ACTIVE
  const [peterMinnie, mayFoxcroft, smallSand, misticoMain, shongweniMain] = await Promise.all([
    prisma.arena.upsert({
      where:  { id: 'arena-peter-minnie' },
      update: { status: 'ACTIVE' },
      create: { id: 'arena-peter-minnie', eventId: event.id, name: 'Peter Minnie Arena', discipline: 'SHOWJUMPING', status: 'ACTIVE', sortOrder: 1 },
    }),
    prisma.arena.upsert({
      where:  { id: 'arena-may-foxcroft' },
      update: { status: 'ARENA_RAKE' },
      create: { id: 'arena-may-foxcroft', eventId: event.id, name: 'May Foxcroft Arena', discipline: 'SHOWJUMPING', status: 'ARENA_RAKE', sortOrder: 2 },
    }),
    prisma.arena.upsert({
      where:  { id: 'arena-small-sand' },
      update: { status: 'ACTIVE' },
      create: { id: 'arena-small-sand', eventId: event.id, name: 'Small Sand Arena', discipline: 'SHOWJUMPING', status: 'ACTIVE', sortOrder: 3 },
    }),
    prisma.arena.upsert({
      where:  { id: 'arena-mistico-main' },
      update: {},
      create: { id: 'arena-mistico-main', eventId: event2.id, name: 'Mistico Main Arena', discipline: 'SHOWJUMPING', status: 'ACTIVE', sortOrder: 1 },
    }),
    prisma.arena.upsert({
      where:  { id: 'arena-shongweni-main' },
      update: {},
      create: { id: 'arena-shongweni-main', eventId: event3.id, name: 'Shongweni Main Arena', discipline: 'SHOWJUMPING', status: 'COMPLETE', sortOrder: 1 },
    }),
  ])

  // ── 6. Classes ───────────────────────────────────────────────────────────────
  console.log('   Creating classes…')

  const [c110pn, c90pn, c110hr, c90hr, c75all, c50all] = await Promise.all([
    // Peter Minnie — 2 classes
    prisma.competitionClass.upsert({
      where:  { eventId_classCode: { eventId: event.id, classCode: 'H5SJCLOtherPn' } },
      update: {},
      create: {
        id: 'class-110-pony', eventId: event.id, arenaId: peterMinnie.id,
        classCode: 'H5SJCLOtherPn', name: 'JUMPING 110cm — 2PHASE COMPETITION PONY',
        height: '110cm', competitionType: '2PHASE', feiArticle: '222.2.3',
        scheduledStartTime: '08:15', expectedRiders: 6, sortOrder: 1,
      },
    }),
    prisma.competitionClass.upsert({
      where:  { eventId_classCode: { eventId: event.id, classCode: 'H3SJCLOtherPn' } },
      update: {},
      create: {
        id: 'class-90-pony', eventId: event.id, arenaId: peterMinnie.id,
        classCode: 'H3SJCLOtherPn', name: 'JUMPING 90cm — 2PHASE COMPETITION PONY',
        height: '90cm', competitionType: '2PHASE', feiArticle: '222.2.3',
        scheduledStartTime: '10:00', expectedRiders: 6, sortOrder: 2,
      },
    }),
    // May Foxcroft — 2 classes
    prisma.competitionClass.upsert({
      where:  { eventId_classCode: { eventId: event.id, classCode: 'H5SJCLCompetitionHr' } },
      update: {},
      create: {
        id: 'class-110-horse', eventId: event.id, arenaId: mayFoxcroft.id,
        classCode: 'H5SJCLCompetitionHr', name: 'JUMPING 110cm A2 COMPETITION HORSE',
        height: '110cm', competitionType: 'A2 COMPETITION', feiArticle: '220.2.1.1',
        scheduledStartTime: '09:00', expectedRiders: 7, sortOrder: 1,
      },
    }),
    prisma.competitionClass.upsert({
      where:  { eventId_classCode: { eventId: event.id, classCode: 'H3SJCLCompetitionHr' } },
      update: {},
      create: {
        id: 'class-90-horse', eventId: event.id, arenaId: mayFoxcroft.id,
        classCode: 'H3SJCLCompetitionHr', name: 'JUMPING 90cm A2 COMPETITION HORSE',
        height: '90cm', competitionType: 'A2 COMPETITION', feiArticle: '220.2.1.1',
        scheduledStartTime: '11:00', expectedRiders: 5, sortOrder: 2,
      },
    }),
    // Small Sand — 2 classes
    prisma.competitionClass.upsert({
      where:  { eventId_classCode: { eventId: event.id, classCode: 'H2SJCLIdealTimeAll' } },
      update: {},
      create: {
        id: 'class-75-ideal', eventId: event.id, arenaId: smallSand.id,
        classCode: 'H2SJCLIdealTimeAll', name: 'JUMPING 75cm IDEAL TIME — OPEN',
        height: '75cm', competitionType: 'IDEAL TIME',
        scheduledStartTime: '08:30', expectedRiders: 6, sortOrder: 1,
      },
    }),
    prisma.competitionClass.upsert({
      where:  { eventId_classCode: { eventId: event.id, classCode: 'H0SJCLIdealTimeAll' } },
      update: {},
      create: {
        id: 'class-50-ideal', eventId: event.id, arenaId: smallSand.id,
        classCode: 'H0SJCLIdealTimeAll', name: 'JUMPING 50cm IDEAL TIME — OPEN',
        height: '50cm', competitionType: 'IDEAL TIME',
        scheduledStartTime: '10:30', expectedRiders: 8, sortOrder: 2,
      },
    }),
  ])

  const cChamps100 = await prisma.competitionClass.upsert({
    where: { eventId_classCode: { eventId: event2.id, classCode: 'H4SJChamps' } },
    update: {},
    create: {
      id: 'class-gauteng-champs-100',
      eventId: event2.id,
      arenaId: misticoMain.id,
      classCode: 'H4SJChamps',
      name: 'JUMPING 100cm — A2 COMPETITION',
      height: '100cm',
      competitionType: 'A2',
      scheduledStartTime: '09:00',
      expectedRiders: 3,
      sortOrder: 1,
      status: 'PENDING'
    }
  })

  const cQ2_90 = await prisma.competitionClass.upsert({
    where: { eventId_classCode: { eventId: event3.id, classCode: 'H3SJQ2' } },
    update: {},
    create: {
      id: 'class-shongweni-90',
      eventId: event3.id,
      arenaId: shongweniMain.id,
      classCode: 'H3SJQ2',
      name: 'JUMPING 90cm — IDEAL TIME',
      height: '90cm',
      competitionType: 'IDEAL_TIME',
      scheduledStartTime: '08:00',
      expectedRiders: 3,
      sortOrder: 1,
      status: 'COMPLETE'
    }
  })

  // ── 7. Running Orders ─────────────────────────────────────────────────────
  // Strategy:
  //   • Orders 1–3 in each active class = pre-seeded CONFIRMED results
  //   • Order 4 in first class = FINISHED (pending judge confirmation)
  //   • Orders 5+ = SCHEDULED / CHECKED_IN / AT_GATE
  //   • Cross-class riders: jaimie (pony+horse), hannah (horse110+horse90),
  //     kylie (horse110+horse90), amber (pony110+horse90), grace (pony90+horse90+ideal75)
  //     sophie (pony90+ideal75), chloe (pony90+ideal75), arlia (ideal75+ideal50),
  //     kirsten (ideal75+ideal50)

  console.log('   Creating running orders…')

  // ── CLASS 1: 110cm Pony — Peter Minnie ─ 6 riders
  await createEntry({ classId: c110pn.id, riderId: jaimie.id,    horseId: redSquare.id,    plannedOrderNo: 1, plannedTime: '08:15',
    result: { elapsedSeconds: 62.14, faults: 0, status: 'FINISHED' } })
  await createEntry({ classId: c110pn.id, riderId: astrid.id,    horseId: caramelito.id,   plannedOrderNo: 2, plannedTime: '08:27',
    result: { elapsedSeconds: 71.88, faults: 4, status: 'FINISHED' } })
  await createEntry({ classId: c110pn.id, riderId: shelly.id,    horseId: royalFavour.id,  plannedOrderNo: 3, plannedTime: '08:39',
    result: { elapsedSeconds: 58.41, faults: 0, status: 'FINISHED' } })
  await createEntry({ classId: c110pn.id, riderId: lena.id,      horseId: goldRush.id,     plannedOrderNo: 4, plannedTime: '08:51',
    result: { elapsedSeconds: 66.03, faults: 8, status: 'FINISHED', confirmed: false } })
  // Rider 5 = CHECKED_IN; rider 6 = SCHEDULED
  const amberRo110pn = await prisma.runningOrder.create({ data: {
    classId: c110pn.id, riderId: amber.id, horseId: starlight.id,
    plannedOrderNo: 5, plannedTime: '09:03', status: 'CHECKED_IN', checkedInAt: new Date(),
  }})
  await prisma.statusHistory.create({ data: {
    runningOrderId: amberRo110pn.id, oldStatus: 'SCHEDULED', newStatus: 'CHECKED_IN',
    reason: 'Rider arrived', changedBy: 'Gate Marshal',
  }})

  await prisma.runningOrder.create({ data: {
    classId: c110pn.id, riderId: zara.id, horseId: silverbell.id,
    plannedOrderNo: 6, plannedTime: '09:15', status: 'SCHEDULED',
  }})

  // ── CLASS 2: 90cm Pony — Peter Minnie ─ 6 riders
  // Trinity is AT_GATE (ready for timer)
  const trinityRo = await prisma.runningOrder.create({ data: {
    classId: c90pn.id, riderId: trinity.id, horseId: atlantic.id,
    plannedOrderNo: 1, plannedTime: '10:00', status: 'AT_GATE', checkedInAt: new Date(),
  }})
  await prisma.statusHistory.create({ data: {
    runningOrderId: trinityRo.id, oldStatus: 'SCHEDULED', newStatus: 'CHECKED_IN',
    reason: 'Rider arrived', changedBy: 'Gate Marshal',
  }})
  await prisma.statusHistory.create({ data: {
    runningOrderId: trinityRo.id, oldStatus: 'CHECKED_IN', newStatus: 'AT_GATE',
    reason: 'Rider at gate', changedBy: 'Gate Marshal',
  }})

  await prisma.runningOrder.create({ data: { classId: c90pn.id, riderId: micaela.id, horseId: midnightZidi.id, plannedOrderNo: 2, plannedTime: '10:12', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c90pn.id, riderId: grace.id,   horseId: missDaisy.id,   plannedOrderNo: 3, plannedTime: '10:24', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c90pn.id, riderId: sophie.id,  horseId: lazyHazel.id,   plannedOrderNo: 4, plannedTime: '10:36', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c90pn.id, riderId: chloe.id,   horseId: pegasus.id,     plannedOrderNo: 5, plannedTime: '10:48', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c90pn.id, riderId: emma.id,    horseId: aandag.id,      plannedOrderNo: 6, plannedTime: '11:00', status: 'SCHEDULED' }})

  // ── CLASS 3: 110cm Horse — May Foxcroft (ARENA_RAKE) ─ 7 riders
  // All confirmed — arena is between classes, shows realistic mid-event state
  await createEntry({ classId: c110hr.id, riderId: hannah.id,    horseId: zeidasDream.id,   plannedOrderNo: 1, plannedTime: '09:00',
    result: { elapsedSeconds: 74.22, faults: 0, status: 'FINISHED' } })
  await createEntry({ classId: c110hr.id, riderId: jaimie.id,    horseId: callahoLarlue.id, plannedOrderNo: 2, plannedTime: '09:12',
    // Jaimie (GP11943) appears here with a different horse — cross-class entry
    result: { elapsedSeconds: 69.50, faults: 4, status: 'FINISHED' } })
  await createEntry({ classId: c110hr.id, riderId: isabella.id,  horseId: joyField.id,      plannedOrderNo: 3, plannedTime: '09:24',
    result: { elapsedSeconds: 83.10, faults: 0, status: 'FINISHED' } })
  await createEntry({ classId: c110hr.id, riderId: marise.id,    horseId: heartOfCaesour.id,plannedOrderNo: 4, plannedTime: '09:36',
    result: { elapsedSeconds: 78.66, faults: 8, status: 'FINISHED' } })
  await createEntry({ classId: c110hr.id, riderId: kylie.id,     horseId: farHills.id,      plannedOrderNo: 5, plannedTime: '09:48',
    result: { elapsedSeconds: 91.33, faults: 0, status: 'FINISHED' } })
  await createEntry({ classId: c110hr.id, riderId: nadia.id,     horseId: siberianPunch.id, plannedOrderNo: 6, plannedTime: '10:00',
    result: { elapsedSeconds: 77.08, faults: 4, status: 'FINISHED', confirmed: false } })
  await prisma.runningOrder.create({ data: {
    classId: c110hr.id, riderId: jessica.id, horseId: quantumLeap.id,
    plannedOrderNo: 7, plannedTime: '10:12', status: 'SCHEDULED',
    notes: 'Horse tacked up — waiting for arena rake to complete',
  }})

  // ── CLASS 4: 90cm Horse — May Foxcroft ─ 5 riders
  // hannah & kylie appear again with DIFFERENT horses (valid cross-class)
  await createEntry({ classId: c90hr.id, riderId: hannah.id,  horseId: blueOcean.id,    plannedOrderNo: 1, plannedTime: '11:00',
    result: { elapsedSeconds: 59.88, faults: 0, status: 'FINISHED' } })
  await prisma.runningOrder.create({ data: { classId: c90hr.id, riderId: kylie.id,  horseId: shadowPeak.id, plannedOrderNo: 2, plannedTime: '11:10', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c90hr.id, riderId: amber.id,  horseId: fireDancer.id, plannedOrderNo: 3, plannedTime: '11:20', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c90hr.id, riderId: grace.id,  horseId: goldRush.id,   plannedOrderNo: 4, plannedTime: '11:30', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: {
    classId: c90hr.id, riderId: lena.id, horseId: quantumLeap.id,
    plannedOrderNo: 5, plannedTime: '11:40', status: 'SCHEDULED',
    notes: 'Rider to confirm horse availability — possible clash',
  }})

  // ── CLASS 5: 75cm Ideal Time — Small Sand ─ 6 riders
  await createEntry({ classId: c75all.id, riderId: kirsten.id, horseId: missDaisy.id,  plannedOrderNo: 1, plannedTime: '08:30',
    result: { elapsedSeconds: 48.10, faults: 0, status: 'FINISHED' } })
  await createEntry({ classId: c75all.id, riderId: arlia.id,   horseId: aandag.id,     plannedOrderNo: 2, plannedTime: '08:38',
    result: { elapsedSeconds: 51.44, faults: 4, status: 'FINISHED' } })

  // Sophie is AT_GATE for small sand
  const sophieRo = await prisma.runningOrder.create({ data: {
    classId: c75all.id, riderId: sophie.id, horseId: starlight.id,
    plannedOrderNo: 3, plannedTime: '08:46', status: 'AT_GATE', checkedInAt: new Date(),
  }})
  await prisma.statusHistory.create({ data: {
    runningOrderId: sophieRo.id, oldStatus: 'SCHEDULED', newStatus: 'CHECKED_IN',
    reason: 'Rider arrived', changedBy: 'Gate Marshal',
  }})
  await prisma.statusHistory.create({ data: {
    runningOrderId: sophieRo.id, oldStatus: 'CHECKED_IN', newStatus: 'AT_GATE',
    reason: 'Rider at gate', changedBy: 'Gate Marshal',
  }})

  await prisma.runningOrder.create({ data: { classId: c75all.id, riderId: chloe.id,    horseId: silverbell.id, plannedOrderNo: 4, plannedTime: '08:54', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c75all.id, riderId: nadia.id,    horseId: lazyHazel.id,  plannedOrderNo: 5, plannedTime: '09:02', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c75all.id, riderId: emma.id,     horseId: caramelito.id, plannedOrderNo: 6, plannedTime: '09:10', status: 'SCHEDULED' }})

  // ── CLASS 6: 50cm Ideal Time — Small Sand ─ 8 riders
  await prisma.runningOrder.create({ data: { classId: c50all.id, riderId: zara.id,    horseId: pegasus.id,     plannedOrderNo: 1, plannedTime: '10:30', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c50all.id, riderId: jessica.id, horseId: royalFavour.id, plannedOrderNo: 2, plannedTime: '10:38', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c50all.id, riderId: micaela.id, horseId: caramelito.id,  plannedOrderNo: 3, plannedTime: '10:46', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c50all.id, riderId: astrid.id,  horseId: atlantic.id,    plannedOrderNo: 4, plannedTime: '10:54', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: {
    classId: c50all.id, riderId: trinity.id, horseId: midnightZidi.id,
    plannedOrderNo: 5, plannedTime: '11:02', status: 'SCHEDULED',
    notes: 'Rider requested scratch — to be confirmed at gate',
  }})
  await prisma.runningOrder.create({ data: { classId: c50all.id, riderId: arlia.id,   horseId: starlight.id,  plannedOrderNo: 6, plannedTime: '11:10', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c50all.id, riderId: kirsten.id, horseId: aandag.id,     plannedOrderNo: 7, plannedTime: '11:18', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: c50all.id, riderId: grace.id,   horseId: silverbell.id, plannedOrderNo: 8, plannedTime: '11:26', status: 'SCHEDULED' }})

  // ── CLASS 7: 100cm Gauteng Championships (Upcoming) — Mistico Main Arena ─ 3 riders
  await prisma.runningOrder.create({ data: { classId: cChamps100.id, riderId: jaimie.id,  horseId: callahoLarlue.id, plannedOrderNo: 1, plannedTime: '09:00', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: cChamps100.id, riderId: micaela.id, horseId: zeidasDream.id,   plannedOrderNo: 2, plannedTime: '09:10', status: 'SCHEDULED' }})
  await prisma.runningOrder.create({ data: { classId: cChamps100.id, riderId: arlia.id,   horseId: pegasus.id,       plannedOrderNo: 3, plannedTime: '09:20', status: 'SCHEDULED' }})

  // ── CLASS 8: 90cm Qualifier 2 (Complete) — Shongweni Main Arena ─ 3 riders
  await createEntry({ classId: cQ2_90.id, riderId: trinity.id, horseId: pegasus.id,     plannedOrderNo: 1, plannedTime: '08:00',
    result: { elapsedSeconds: 61.20, faults: 0, status: 'FINISHED' } })
  await createEntry({ classId: cQ2_90.id, riderId: astrid.id,  horseId: zeidasDream.id, plannedOrderNo: 2, plannedTime: '08:10',
    result: { elapsedSeconds: 58.45, faults: 4, status: 'FINISHED' } })
  await createEntry({ classId: cQ2_90.id, riderId: shelly.id,  horseId: royalFavour.id, plannedOrderNo: 3, plannedTime: '08:20',
    result: { elapsedSeconds: 65.10, faults: 8, status: 'FINISHED' } })

  // ── Summary ──────────────────────────────────────────────────────────────────
  const [schools, riders, horses, classes, orders, results, history, timers] = await Promise.all([
    prisma.school.count(),
    prisma.rider.count(),
    prisma.horse.count(),
    prisma.competitionClass.count(),
    prisma.runningOrder.count(),
    prisma.result.count(),
    prisma.statusHistory.count(),
    prisma.timerEvent.count(),
  ])

  console.log('')
  console.log('✅  Seed complete!')
  console.log(`   Schools:        ${schools}`)
  console.log(`   Riders:         ${riders}  (9 appear in 2+ classes)`)
  console.log(`   Horses:         ${horses}`)
  console.log(`   Classes:        ${classes}  (2 per arena)`)
  console.log(`   Running orders: ${orders}`)
  console.log(`   Results:        ${results}  (pre-seeded with audit trail)`)
  console.log(`   Status history: ${history}`)
  console.log(`   Timer events:   ${timers}`)
  console.log('')
  console.log('   Live demo state:')
  console.log('   Peter Minnie Arena — 110cm class in progress; Trinity AT_GATE for 90cm')
  console.log('   May Foxcroft Arena — ARENA_RAKE (between classes); 90cm coming up')
  console.log('   Small Sand Arena   — Sophie AT_GATE for 75cm; 50cm starts later')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
