import bcrypt from "bcryptjs"
import jwt, { type SignOptions } from "jsonwebtoken"
import { env } from "../config/env.js"
import { UserModel, type UserRole } from "../models/user.model.js"
import { getNextSequence } from "../models/counter.model.js"
import { HttpError } from "../utils/http-error.js"

type RegisterInput = {
  username: string
  password: string
  role: UserRole
  nom?: string
}

type LoginInput = {
  username: string
  password: string
}

export function signToken(user: { id: number; username: string; role: UserRole; nom?: string }) {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] }
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role, nom: user.nom },
    env.jwtSecret,
    options
  )
}

export async function registerUser(input: RegisterInput) {
  const existing = await UserModel.findOne({ username: input.username }).lean()
  if (existing) throw new HttpError(409, "Ce nom d'utilisateur existe déjà")

  const passwordHash = await bcrypt.hash(input.password, 12)
  const user = await UserModel.create({
    id: await getNextSequence("users"),
    username: input.username,
    password_hash: passwordHash,
    role: input.role,
    nom: input.nom,
  })

  const payload = user.toJSON()
  return { user: payload, token: signToken(payload) }
}

export async function loginUser(input: LoginInput) {
  const user = await UserModel.findOne({ username: input.username }).select("+password_hash")
  if (!user) throw new HttpError(401, "Identifiants invalides")

  const passwordMatches = await bcrypt.compare(input.password, user.password_hash)
  if (!passwordMatches) throw new HttpError(401, "Identifiants invalides")

  const payload = user.toJSON()
  return { user: payload, token: signToken(payload) }
}
