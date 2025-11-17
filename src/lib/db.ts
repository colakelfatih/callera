// Prisma Client Singleton

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
  
  // Disconnect on hot reload to prevent "cached plan" errors after schema changes
  if (typeof window === 'undefined') {
    // Server-side only
    process.on('beforeExit', async () => {
      await db.$disconnect()
    })
  }
}

