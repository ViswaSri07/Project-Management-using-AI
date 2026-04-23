import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

declare global {
  var prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg(process.env.DIRECT_URL as string)
  return new PrismaClient({ adapter } as any)
}

export const db = globalThis.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db
}
