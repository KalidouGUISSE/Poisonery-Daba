// Sale service using Prisma
import { prisma } from "../config/database.js"
import type { Sale } from "@prisma/client"

export type CreateSaleInput = {
  produit_id: number
  produit_nom: string
  poids_kg: number
  prix_total: number
  vendeur_id: number
  vendeur_nom: string
}

export type CreateMultipleSalesInput = {
  products: CreateSaleInput[]
}

export class SaleService {
  static async findById(id: number): Promise<Sale | null> {
    return prisma.sale.findUnique({
      where: { id },
      include: {
        user: true,
        product: true,
      },
    })
  }

  static async findAll(page = 1, limit = 10): Promise<{
    sales: Sale[]
    pagination: {
      page: number
      limit: number
      totalSales: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const totalSales = await prisma.sale.count()
    const totalPages = Math.ceil(totalSales / limit)
    const skip = (page - 1) * limit

    const sales = await prisma.sale.findMany({
      include: {
        user: true,
        product: true,
      },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    })

    return {
      sales,
      pagination: {
        page,
        limit,
        totalSales,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }
  }

  static async create(input: CreateSaleInput): Promise<Sale> {
    // Vérifier que le produit existe et a suffisamment de stock
    const product = await prisma.product.findUnique({
      where: { id: input.produit_id },
    })

    if (!product) {
      throw new Error("Produit non trouvé")
    }

    if (product.quantite_stock < input.poids_kg) {
      throw new Error("Stock insuffisant")
    }

    // Créer la vente dans une transaction pour garantir la cohérence
    return prisma.$transaction(async (tx) => {
      // Créer la vente
      const sale = await tx.sale.create({
        data: {
          produit_id: input.produit_id,
          produit_nom: input.produit_nom,
          poids_kg: input.poids_kg,
          prix_total: input.prix_total,
          vendeur_id: input.vendeur_id,
          vendeur_nom: input.vendeur_nom,
          date_vente: new Date(),
        },
      })

      // Mettre à jour le stock du produit
      await tx.product.update({
        where: { id: input.produit_id },
        data: {
          quantite_stock: product.quantite_stock - input.poids_kg,
          updated_at: new Date(),
        },
      })

      return sale
    })
  }

  static async createMultiple(input: CreateMultipleSalesInput): Promise<Sale[]> {
    const sales: Sale[] = []

    for (const saleInput of input.products) {
      const sale = await this.create(saleInput)
      sales.push(sale)
    }

    return sales
  }

  static async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return prisma.sale.findMany({
      where: {
        date_vente: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
        product: true,
      },
      orderBy: { date_vente: "desc" },
    })
  }

  static async getSalesBySeller(sellerId: number): Promise<Sale[]> {
    return prisma.sale.findMany({
      where: { vendeur_id: sellerId },
      include: {
        product: true,
      },
      orderBy: { date_vente: "desc" },
    })
  }

  static async getSalesByProduct(productId: number): Promise<Sale[]> {
    return prisma.sale.findMany({
      where: { produit_id: productId },
      include: {
        user: true,
      },
      orderBy: { date_vente: "desc" },
    })
  }

  static async getTotalRevenue(): Promise<number> {
    const result = await prisma.sale.aggregate({
      _sum: {
        prix_total: true,
      },
    })
    return result._sum.prix_total || 0
  }

  static async getRevenueByPeriod(startDate: Date, endDate: Date): Promise<number> {
    const result = await prisma.sale.aggregate({
      where: {
        date_vente: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        prix_total: true,
      },
    })
    return result._sum.prix_total || 0
  }
}