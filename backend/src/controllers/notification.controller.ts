// Notification controller using Prisma services
import { Request, Response } from "express"
import { NotificationService } from "../services/notification.service.js"
import { ClientService } from "../services/client.service.js"
import { asyncHandler } from "../utils/async-handler.js"

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10" } = req.query

  const result = await NotificationService.findAll(
    parseInt(page as string),
    parseInt(limit as string)
  )
  res.json(result)
})

export const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const notification = await NotificationService.findById(parseInt(id))

  if (!notification) {
    return res.status(404).json({ error: "Notification non trouvée" })
  }

  res.json(notification)
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  const notification = await NotificationService.create(req.body)
  res.status(201).json(notification)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { id: notificationId, lu, ...updateData } = req.body

  // Si on met à jour le statut lu
  if (lu !== undefined) {
    const notification = await NotificationService.markAsRead(parseInt(id))
    return res.json(notification)
  }

  // Mise à jour générale
  const notification = await NotificationService.update(parseInt(id), updateData)
  res.json(notification)
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const notification = await NotificationService.delete(parseInt(id))
  res.json(notification)
})

export const sendRestockNotification = asyncHandler(async (req: Request, res: Response) => {
  const { products, sendToAll, envoyePar, targetClientIds } = req.body

  // Déterminer les destinataires
  let finalTargetClientIds: number[] | undefined

  if (!sendToAll && !targetClientIds) {
    // Trouver les clients qui ont ces produits dans leurs préférences
    const clients = await ClientService.findByPreferences(products.map((p: any) => p.nom))
    finalTargetClientIds = clients.map(c => c.id)
  } else if (!sendToAll) {
    finalTargetClientIds = targetClientIds
  }

  const notification = await NotificationService.createRestockNotification(
    products,
    sendToAll,
    envoyePar,
    finalTargetClientIds
  )

  res.status(201).json({
    success: true,
    notification,
  })
})

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const count = await NotificationService.getUnreadCount()
  res.json({ count })
})