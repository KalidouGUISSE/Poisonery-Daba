import { promises as fs } from "fs"
import path from "path"
import bcrypt from "bcryptjs"
import { connectDatabase, disconnectDatabase } from "../config/database.js"
import { env } from "../config/env.js"
import { CounterModel } from "../models/counter.model.js"
import { ClientModel } from "../models/client.model.js"
import { NotificationModel } from "../models/notification.model.js"
import { ProductModel } from "../models/product.model.js"
import { SaleModel } from "../models/sale.model.js"
import { UserModel } from "../models/user.model.js"

type JsonData = {
  users: Array<{ id: number; username: string; role: "admin" | "vendeur"; nom?: string; created_at?: string }>
  products: unknown[]
  sales: unknown[]
  clients: unknown[]
  notifications: unknown[]
}

async function readFrontendData(): Promise<JsonData> {
  const dataPath = path.resolve(process.cwd(), "..", "frontend", "data", "data.json")
  const content = await fs.readFile(dataPath, "utf-8")
  return JSON.parse(content)
}

async function upsertCounter(name: string, maxId: number) {
  await CounterModel.findByIdAndUpdate(name, { seq: maxId }, { upsert: true })
}

async function seed() {
  await connectDatabase()
  const data = await readFrontendData()

  await Promise.all([
    UserModel.deleteMany({}),
    ProductModel.deleteMany({}),
    SaleModel.deleteMany({}),
    ClientModel.deleteMany({}),
    NotificationModel.deleteMany({}),
    CounterModel.deleteMany({}),
  ])

  const users = await Promise.all(
    data.users.map(async (user) => {
      const password = user.role === "admin" ? env.defaultAdminPassword : env.defaultSellerPassword
      return {
        ...user,
        username: user.username.toLowerCase(),
        password_hash: await bcrypt.hash(password, 12),
        created_at: user.created_at ? new Date(user.created_at) : new Date(),
        updated_at: new Date(),
      }
    })
  )

  await UserModel.insertMany(users)
  await ProductModel.insertMany(data.products)
  await SaleModel.insertMany(data.sales)
  await ClientModel.insertMany(data.clients)
  await NotificationModel.insertMany(data.notifications)

  await Promise.all([
    upsertCounter("users", Math.max(0, ...data.users.map((item) => item.id))),
    upsertCounter("products", Math.max(0, ...data.products.map((item: any) => item.id))),
    upsertCounter("sales", Math.max(0, ...data.sales.map((item: any) => item.id))),
    upsertCounter("clients", Math.max(0, ...data.clients.map((item: any) => item.id))),
    upsertCounter("notifications", Math.max(0, ...data.notifications.map((item: any) => item.id))),
  ])

  await disconnectDatabase()
  console.log("Seed terminé depuis ../data/data.json")
}

seed().catch(async (error) => {
  console.error("Seed failed", error)
  await disconnectDatabase()
  process.exit(1)
})
