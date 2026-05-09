// User service using Prisma
import bcrypt from "bcryptjs"
import { prisma } from "../config/database.js"
import type { User, UserRole } from "@prisma/client"

export type CreateUserInput = {
  username: string
  password: string
  role: UserRole
  nom?: string
}

export type UpdateUserInput = {
  username?: string
  role?: UserRole
  nom?: string
}

export class UserService {
  static async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  static async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    })
  }

  static async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { created_at: "desc" },
    })
  }

  static async create(input: CreateUserInput): Promise<User> {
    const password_hash = await bcrypt.hash(input.password, 12)

    return prisma.user.create({
      data: {
        username: input.username.toLowerCase(),
        password_hash,
        role: input.role,
        nom: input.nom,
      },
    })
  }

  static async update(id: number, input: UpdateUserInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        ...(input.username && { username: input.username.toLowerCase() }),
        ...(input.role && { role: input.role }),
        ...(input.nom !== undefined && { nom: input.nom }),
        updated_at: new Date(),
      },
    })
  }

  static async delete(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    })
  }

  static async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash)
  }

  static formatUser(user: User): Omit<User, "password_hash"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}