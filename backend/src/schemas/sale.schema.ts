import { z } from "zod"

export const saleItemSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  produit_id: z.coerce.number().int().positive(),
  produit_nom: z.string().min(1).trim(),
  poids_kg: z.coerce.number().positive(),
  prix_total: z.coerce.number().min(0),
  date_vente: z.coerce.date().optional(),
  vendeur_id: z.coerce.number().int().positive(),
  vendeur_nom: z.string().min(1).trim(),
})

export const saleCreateSchema = z.union([
  saleItemSchema,
  z.object({
    products: z.array(saleItemSchema).min(1),
  }),
])

export const saleQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(50),
  sortBy: z.enum(["date_vente", "created_at", "prix_total", "poids_kg"]).default("date_vente"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  produit_id: z.coerce.number().int().positive().optional(),
  vendeur_id: z.coerce.number().int().positive().optional(),
})
