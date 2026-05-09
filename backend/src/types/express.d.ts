import type { UserRole } from "../models/user.model.js"

declare global {
  namespace Express {
    interface User {
      id: number
      username: string
      role: UserRole
      nom?: string
    }

    interface Request {
      user?: User
    }
  }
}

export {}
