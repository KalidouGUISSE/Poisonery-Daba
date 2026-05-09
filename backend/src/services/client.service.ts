// Client service using Prisma
import { prisma } from "../config/database.js"
import type { Client } from "@prisma/client"

export type CreateClientInput = {
  nom: string
  prenom: string
  telephone: string
  email?: string
  adresse?: string
  preferences?: string[]
  actif?: boolean
}

export type UpdateClientInput = {
  nom?: string
  prenom?: string
  telephone?: string
  email?: string
  adresse?: string
  preferences?: string[]
  actif?: boolean
}

export type ClientFilters = {
  search?: string
  actif?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export class ClientService {
  static async findById(id: number): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { id },
    })
  }

  static async findAll(filters: ClientFilters = {}): Promise<{
    clients: Client[]
    pagination: {
      page: number
      limit: number
      totalClients: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const {
      search,
      actif,
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
        { prenom: { contains: search, mode: "insensitive" } },
        { telephone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    // Filtre par statut actif
    if (actif !== undefined) {
      where.actif = actif
    }

    // Tri
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const totalClients = await prisma.client.count({ where })
    const totalPages = Math.ceil(totalClients / limit)
    const skip = (page - 1) * limit

    const clients = await prisma.client.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    })

    return {
      clients,
      pagination: {
        page,
        limit,
        totalClients,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }
  }

  static async create(input: CreateClientInput): Promise<Client> {
    return prisma.client.create({
      data: {
        nom: input.nom,
        prenom: input.prenom,
        telephone: input.telephone,
        email: input.email || "",
        adresse: input.adresse || "",
        preferences: input.preferences || [],
        actif: input.actif ?? true,
      },
    })
  }

  static async update(id: number, input: UpdateClientInput): Promise<Client> {
    return prisma.client.update({
      where: { id },
      data: {
        ...(input.nom && { nom: input.nom }),
        ...(input.prenom && { prenom: input.prenom }),
        ...(input.telephone && { telephone: input.telephone }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.adresse !== undefined && { adresse: input.adresse }),
        ...(input.preferences && { preferences: input.preferences }),
        ...(input.actif !== undefined && { actif: input.actif }),
        updated_at: new Date(),
      },
    })
  }

  static async delete(id: number): Promise<Client> {
    return prisma.client.delete({
      where: { id },
    })
  }

  static async findByPreferences(productNames: string[]): Promise<Client[]> {
    return prisma.client.findMany({
      where: {
        actif: true,
        preferences: {
          hasSome: productNames,
        },
      },
    })
  }

  static async getActiveClients(): Promise<Client[]> {
    return prisma.client.findMany({
      where: { actif: true },
      orderBy: { nom: "asc" },
    })
  }
}