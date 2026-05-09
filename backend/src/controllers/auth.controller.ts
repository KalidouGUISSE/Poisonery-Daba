// Auth controller using Prisma services
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { UserService } from "../services/user.service.js"
import { env } from "../config/env.js"
import { asyncHandler } from "../utils/async-handler.js"

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: "Nom d'utilisateur et mot de passe requis" })
  }

  // Trouver l'utilisateur
  const user = await UserService.findByUsername(username)
  if (!user) {
    return res.status(401).json({ error: "Identifiants invalides" })
  }

  // Vérifier le mot de passe
  const isValidPassword = await UserService.validatePassword(user, password)
  if (!isValidPassword) {
    return res.status(401).json({ error: "Identifiants invalides" })
  }

  // Générer le token JWT
  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  )

  // Retourner l'utilisateur et le token
  res.json({
    user: UserService.formatUser(user),
    token,
  })
})

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, role, nom } = req.body

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Nom d'utilisateur, mot de passe et rôle requis" })
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await UserService.findByUsername(username)
  if (existingUser) {
    return res.status(409).json({ error: "Nom d'utilisateur déjà utilisé" })
  }

  // Créer l'utilisateur
  const user = await UserService.create({
    username,
    password,
    role: role as "admin" | "vendeur",
    nom,
  })

  res.status(201).json(UserService.formatUser(user))
})

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  // Récupérer l'utilisateur depuis les middlewares d'authentification
  const user = (req as any).user
  if (!user) {
    return res.status(401).json({ error: "Non authentifié" })
  }

  res.json(UserService.formatUser(user))
})

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user
  if (!user) {
    return res.status(401).json({ error: "Non authentifié" })
  }

  const { nom } = req.body
  const updatedUser = await UserService.update(user.id, { nom })

  res.json(UserService.formatUser(updatedUser))
})