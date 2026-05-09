// Database service using Prisma
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log("✅ Connected to PostgreSQL database")
  } catch (error) {
    console.error("❌ Failed to connect to database:", error)
    throw error
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
    console.log("✅ Disconnected from database")
  } catch (error) {
    console.error("❌ Error disconnecting from database:", error)
  }
}