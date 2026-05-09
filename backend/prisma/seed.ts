import { config } from "dotenv"
import { promises as fs } from "fs"
import path from "path"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

// Charger les variables d'environnement
config()

const prisma = new PrismaClient()

type JsonData = {
  users: Array<{
    id: number
    username: string
    role: "admin" | "vendeur"
    nom?: string
    created_at?: string
  }>
  products: Array<{
    id: number
    nom: string
    categorie: string
    prix_kg: number
    quantite_stock: number
    image: string
    created_at?: string
    updated_at?: string
  }>
  sales: Array<{
    id: number
    produit_id: number
    produit_nom: string
    poids_kg: number
    prix_total: number
    date_vente: string
    vendeur_id: number
    vendeur_nom: string
    created_at?: string
  }>
  clients: Array<{
    id: number
    nom: string
    prenom: string
    telephone: string
    email: string
    adresse: string
    preferences: string[]
    actif: boolean
    created_at?: string
    updated_at?: string
  }>
  notifications: Array<{
    id: number
    type: "restock" | "promotion" | "manual"
    titre: string
    message: string
    produits: string[]
    destinataires_type: "all" | "cibles"
    destinataires_ids: number[]
    envoye_par: string
    created_at?: string
    lu: boolean
  }>
}

async function readFrontendData(): Promise<JsonData> {
  const dataPath = path.resolve(process.cwd(), "..", "frontend", "data", "data.json")
  const content = await fs.readFile(dataPath, "utf-8")
  return JSON.parse(content)
}

async function seed() {
  console.log("🌱 Seeding database with Prisma...")

  const data = await readFrontendData()

  // Clear existing data
  console.log("🧹 Clearing existing data...")
  await prisma.notification.deleteMany({})
  await prisma.sale.deleteMany({})
  await prisma.client.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.user.deleteMany({})

  // Seed users
  console.log("👥 Seeding users...")
  const users = await Promise.all(
    data.users.map(async (user) => {
      const password = user.role === "admin"
        ? process.env.DEFAULT_ADMIN_PASSWORD || "admin123"
        : process.env.DEFAULT_SELLER_PASSWORD || "vendeur123"

      return {
        id: user.id,
        username: user.username.toLowerCase(),
        password_hash: await bcrypt.hash(password, 12),
        role: user.role,
        nom: user.nom || null,
        created_at: user.created_at ? new Date(user.created_at) : new Date(),
        updated_at: new Date(),
      }
    })
  )
  await prisma.user.createMany({ data: users })

  // Seed products
  console.log("🐟 Seeding products...")
  const products = data.products.map((product) => ({
    id: product.id,
    nom: product.nom,
    categorie: product.categorie,
    prix_kg: product.prix_kg,
    quantite_stock: product.quantite_stock,
    image: product.image || "",
    created_at: product.created_at ? new Date(product.created_at) : new Date(),
    updated_at: product.updated_at ? new Date(product.updated_at) : new Date(),
  }))
  await prisma.product.createMany({ data: products })

  // Seed clients
  console.log("👨‍👩‍👧‍👦 Seeding clients...")
  const clients = data.clients.map((client) => ({
    id: client.id,
    nom: client.nom,
    prenom: client.prenom,
    telephone: client.telephone,
    email: client.email || "",
    adresse: client.adresse || "",
    preferences: client.preferences || [],
    actif: client.actif ?? true,
    created_at: client.created_at ? new Date(client.created_at) : new Date(),
    updated_at: client.updated_at ? new Date(client.updated_at) : new Date(),
  }))
  await prisma.client.createMany({ data: clients })

  // Seed notifications
  console.log("📢 Seeding notifications...")
  const notifications = data.notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    titre: notification.titre,
    message: notification.message,
    produits: notification.produits || [],
    destinataires_type: notification.destinataires_type,
    destinataires_ids: notification.destinataires_ids || [],
    envoye_par: notification.envoye_par,
    created_at: notification.created_at ? new Date(notification.created_at) : new Date(),
    lu: notification.lu ?? false,
  }))
  await prisma.notification.createMany({ data: notifications })

  // Seed sales
  console.log("💰 Seeding sales...")
  const sales = data.sales.map((sale) => ({
    id: sale.id,
    produit_id: sale.produit_id,
    produit_nom: sale.produit_nom,
    poids_kg: sale.poids_kg,
    prix_total: sale.prix_total,
    date_vente: new Date(sale.date_vente),
    vendeur_id: sale.vendeur_id,
    vendeur_nom: sale.vendeur_nom,
    created_at: sale.created_at ? new Date(sale.created_at) : new Date(),
  }))
  await prisma.sale.createMany({ data: sales })

  console.log("✅ Database seeded successfully!")
  console.log(`   📊 ${users.length} users`)
  console.log(`   🐟 ${products.length} products`)
  console.log(`   👥 ${clients.length} clients`)
  console.log(`   📢 ${notifications.length} notifications`)
  console.log(`   💰 ${sales.length} sales`)
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })