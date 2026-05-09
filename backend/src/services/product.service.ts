// Product service using Prisma
import { prisma } from "../config/database.js"
import type { Product } from "@prisma/client"

export type CreateProductInput = {
  nom: string
  categorie: string
  prix_kg: number
  quantite_stock: number
  image?: string
}

export type UpdateProductInput = {
  nom?: string
  categorie?: string
  prix_kg?: number
  quantite_stock?: number
  image?: string
}

export type ProductFilters = {
  search?: string
  categorie?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export class ProductService {
  static async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    })
  }

  static async findAll(filters: ProductFilters = {}): Promise<{
    products: Product[]
    pagination: {
      page: number
      limit: number
      totalProducts: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const {
      search,
      categorie,
      page = 1,
      limit = 10,
      sortBy = "nom",
      sortOrder = "asc",
    } = filters

    const where: any = {}

    // Recherche textuelle
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" } },
        { categorie: { contains: search, mode: "insensitive" } },
      ]
    }

    // Filtre par catégorie
    if (categorie) {
      where.categorie = categorie
    }

    // Tri
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const totalProducts = await prisma.product.count({ where })
    const totalPages = Math.ceil(totalProducts / limit)
    const skip = (page - 1) * limit

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    })

    return {
      products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }
  }

  static async create(input: CreateProductInput): Promise<Product> {
    return prisma.product.create({
      data: {
        nom: input.nom,
        categorie: input.categorie,
        prix_kg: input.prix_kg,
        quantite_stock: input.quantite_stock,
        image: input.image || "",
      },
    })
  }

  static async update(id: number, input: UpdateProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        ...(input.nom && { nom: input.nom }),
        ...(input.categorie && { categorie: input.categorie }),
        ...(input.prix_kg !== undefined && { prix_kg: input.prix_kg }),
        ...(input.quantite_stock !== undefined && { quantite_stock: input.quantite_stock }),
        ...(input.image !== undefined && { image: input.image }),
        updated_at: new Date(),
      },
    })
  }

  static async delete(id: number): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    })
  }

  static async updateStock(id: number, newStock: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        quantite_stock: newStock,
        updated_at: new Date(),
      },
    })
  }

  static async getCategories(): Promise<string[]> {
    const categories = await prisma.product.findMany({
      select: { categorie: true },
      distinct: ["categorie"],
      orderBy: { categorie: "asc" },
    })
    return categories.map(c => c.categorie)
  }
}