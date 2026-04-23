import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

declare global {
  var prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL or DIRECT_URL environment variable is required")
  }
  const adapter = new PrismaPg(connectionString)
  return new PrismaClient({ adapter } as any)
}

export const db = globalThis.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db
}
