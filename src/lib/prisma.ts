import { PrismaClient } from '@prisma/client'

let prismaClient: PrismaClient

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

if (globalForPrisma.prisma) {
  prismaClient = globalForPrisma.prisma
} else {
  const dbUrl = process.env.DATABASE_URL || ''
  
  if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
    const { Pool } = require('pg')
    const { PrismaPg } = require('@prisma/adapter-pg')
    const pool = new Pool({ connectionString: dbUrl })
    const adapter = new PrismaPg(pool)
    prismaClient = new PrismaClient({ adapter })
  } else {
    // SQLite local development fallback
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    const adapter = new PrismaBetterSqlite3({ url: dbUrl || 'file:./dev.db' })
    prismaClient = new PrismaClient({ adapter })
  }
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient
  }
}

export const prisma = prismaClient
