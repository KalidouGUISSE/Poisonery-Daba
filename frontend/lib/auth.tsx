"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "admin" | "vendeur"

export interface User {
  id: number
  username: string
  role: UserRole
  nom?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database with encrypted passwords (using simple base64 for demo)
const MOCK_USERS = [
  {
    id: 1,
    username: "admin",
    password: btoa("admin123"), // encrypted password
    role: "admin" as UserRole,
    nom: "Administrateur",
  },
  {
    id: 2,
    username: "vendeur1",
    password: btoa("vendeur123"), // encrypted password
    role: "vendeur" as UserRole,
    nom: "Vendeur 1",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("fish_shop_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Find user with matching credentials
    const foundUser = MOCK_USERS.find((u) => u.username === username && u.password === btoa(password))

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        nom: foundUser.nom,
      }
      setUser(userData)
      localStorage.setItem("fish_shop_user", JSON.stringify(userData))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("fish_shop_user")
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
