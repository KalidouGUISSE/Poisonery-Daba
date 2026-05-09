import { z } from "zod"

export const registerSchema = z.object({
  username: z.string().min(3).max(50).trim().toLowerCase(),
  password: z.string().min(6).max(100),
  role: z.enum(["admin", "vendeur"]).default("vendeur"),
  nom: z.string().min(2).max(100).optional(),
})

export const loginSchema = z.object({
  username: z.string().min(1).trim().toLowerCase(),
  password: z.string().min(1),
})
