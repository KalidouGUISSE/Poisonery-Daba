import { z } from "zod"

export const notificationBodySchema = z.object({
  type: z.enum(["restock", "promotion", "manual"]),
  titre: z.string().min(1).max(160).trim(),
  message: z.string().min(1).max(1200).trim(),
  produits: z.array(z.string().trim()).default([]),
  destinataires_type: z.enum(["all", "cibles"]),
  destinataires_ids: z.array(z.coerce.number().int().positive()).default([]),
})

export const notificationReadSchema = z.object({
  id: z.coerce.number().int().positive(),
  lu: z.boolean(),
})

export const restockNotificationSchema = z.object({
  products: z.array(z.object({
    id: z.coerce.number().int().positive().optional(),
    nom: z.string().min(1).trim(),
  })).min(1),
  sendToAll: z.boolean().default(false),
  targetClientIds: z.array(z.coerce.number().int().positive()).optional(),
  envoyePar: z.string().min(1).default("Administrateur"),
})
