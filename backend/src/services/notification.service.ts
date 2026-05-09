// Notification service using Prisma
import { prisma } from "../config/database.js"
import type { Notification } from "@prisma/client"

export type CreateNotificationInput = {
  type: "restock" | "promotion" | "manual"
  titre: string
  message: string
  produits?: string[]
  destinataires_type: "all" | "cibles"
  destinataires_ids?: number[]
  envoye_par: string
}

export type UpdateNotificationInput = {
  titre?: string
  message?: string
  lu?: boolean
}

export class NotificationService {
  static async findById(id: number): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
    })
  }

  static async findAll(page = 1, limit = 10): Promise<{
    notifications: Notification[]
    pagination: {
      page: number
      limit: number
      totalNotifications: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }> {
    const totalNotifications = await prisma.notification.count()
    const totalPages = Math.ceil(totalNotifications / limit)
    const skip = (page - 1) * limit

    const notifications = await prisma.notification.findMany({
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    })

    return {
      notifications,
      pagination: {
        page,
        limit,
        totalNotifications,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }
  }

  static async create(input: CreateNotificationInput): Promise<Notification> {
    return prisma.notification.create({
      data: {
        type: input.type,
        titre: input.titre,
        message: input.message,
        produits: input.produits || [],
        destinataires_type: input.destinataires_type,
        destinataires_ids: input.destinataires_ids || [],
        envoye_par: input.envoye_par,
      },
    })
  }

  static async update(id: number, input: UpdateNotificationInput): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: {
        ...(input.titre && { titre: input.titre }),
        ...(input.message && { message: input.message }),
        ...(input.lu !== undefined && { lu: input.lu }),
      },
    })
  }

  static async delete(id: number): Promise<Notification> {
    return prisma.notification.delete({
      where: { id },
    })
  }

  static async markAsRead(id: number): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { lu: true },
    })
  }

  static async createRestockNotification(
    products: Array<{ id: number; nom: string }>,
    sendToAll: boolean,
    envoyePar: string,
    targetClientIds?: number[]
  ): Promise<Notification> {
    const productNames = products.map(p => p.nom)

    return prisma.notification.create({
      data: {
        type: "restock",
        titre: "Réapprovisionnement disponible",
        message: `Les produits suivants sont maintenant disponibles : ${productNames.join(", ")}`,
        produits: productNames,
        destinataires_type: sendToAll ? "all" : "cibles",
        destinataires_ids: sendToAll ? [] : (targetClientIds || []),
        envoye_par: envoyePar,
      },
    })
  }

  static async createPromotionNotification(
    title: string,
    message: string,
    products: string[],
    sendToAll: boolean,
    targetClientIds: number[],
    envoyePar: string
  ): Promise<Notification> {
    return prisma.notification.create({
      data: {
        type: "promotion",
        titre: title,
        message,
        produits: products,
        destinataires_type: sendToAll ? "all" : "cibles",
        destinataires_ids: sendToAll ? [] : targetClientIds,
        envoye_par: envoyePar,
      },
    })
  }

  static async getUnreadCount(): Promise<number> {
    return prisma.notification.count({
      where: { lu: false },
    })
  }

  static async getNotificationsByType(type: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { type: type as any },
      orderBy: { created_at: "desc" },
    })
  }
}