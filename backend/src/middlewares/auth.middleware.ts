import jwt from "jsonwebtoken"
import type { NextFunction, Request, Response } from "express"
import { env } from "../config/env.js"
import type { UserRole } from "../models/user.model.js"
import { HttpError } from "../utils/http-error.js"

type JwtPayload = {
  sub: number
  username: string
  role: UserRole
  nom?: string
}

function readBearerToken(req: Request) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) return null
  return header.slice("Bearer ".length)
}

export function attachUser(req: Request, _res: Response, next: NextFunction) {
  const token = readBearerToken(req)
  if (!token) return next()

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as unknown as JwtPayload
    req.user = {
      id: Number(decoded.sub),
      username: decoded.username,
      role: decoded.role,
      nom: decoded.nom,
    }
  } catch {
    if (env.authRequired) throw new HttpError(401, "Token invalide ou expiré")
  }

  next()
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!env.authRequired) return next()
  if (!req.user) throw new HttpError(401, "Authentification requise")
  next()
}

export function requireRoles(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!env.authRequired) return next()
    if (!req.user) throw new HttpError(401, "Authentification requise")
    if (!roles.includes(req.user.role)) throw new HttpError(403, "Accès refusé")
    next()
  }
}
