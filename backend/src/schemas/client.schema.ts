import { z } from "zod"

export const clientBodySchema = z.object({
  nom: z.string().min(1).max(100).trim(),
  prenom: z.string().min(1).max(100).trim(),
  telephone: z.string().min(5).max(30).trim(),
  email: z.string().email().or(z.literal("")).default(""),
  adresse: z.string().max(240).default(""),
  preferences: z.array(z.string().trim()).default([]),
  actif: z.boolean().default(true),
})

export const clientUpdateSchema = clientBodySchema.partial()

export const clientQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(10),
  sortBy: z.enum(["nom", "prenom", "telephone", "email", "adresse", "created_at", "updated_at"]).default("nom"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  search: z.string().default(""),
})
