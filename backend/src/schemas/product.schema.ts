import { z } from "zod"

export const productBodySchema = z.object({
  nom: z.string().min(1).max(120).trim(),
  categorie: z.string().min(1).max(80).trim(),
  prix_kg: z.coerce.number().positive(),
  quantite_stock: z.coerce.number().min(0),
  image: z.string().default(""),
})

export const productUpdateSchema = productBodySchema.partial()

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(10),
  sortBy: z.enum(["nom", "categorie", "prix_kg", "quantite_stock", "created_at", "updated_at"]).default("nom"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  search: z.string().default(""),
})
