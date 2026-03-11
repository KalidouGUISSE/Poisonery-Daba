"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useEffect } from "react"
import { Product, Sale, User, Client, Notification } from "./types"

export type { Product, Sale, User, Client, Notification }

// Hook pour initialiser les données
export function useInitializeStore() {
  const initializeData = useStore((state) => state.initializeData)

  useEffect(() => {
    initializeData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

interface StoreState {
  products: Product[]
  sales: Sale[]
  users: User[]
  clients: Client[]
  notifications: Notification[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => void
  addSale: (sale: Omit<Sale, 'id'>) => void
  updateStock: (productId: number, quantity: number) => void
  getUsers: () => User[]
  initializeData: () => Promise<void>
  // Clients
  addClient: (client: any) => Promise<void>
  updateClient: (id: number, client: any) => Promise<void>
  deleteClient: (id: number) => Promise<void>
  // Notifications
  addNotification: (notification: any) => Promise<void>
  markNotificationRead: (id: number, lu: boolean) => Promise<void>
  sendRestockNotification: (products: any[], sendToAll: boolean, targetClientIds?: number[]) => Promise<void>
}

// Fonction pour charger les données initiales depuis l'API
async function loadInitialData() {
  try {
    const response = await fetch('/api/initial-data')
    if (!response.ok) {
      throw new Error('Failed to fetch initial data')
    }
    const data = await response.json()

    return {
      products: data.products || [],
      users: data.users || [],
      sales: data.sales || []
    }
  } catch (error) {
    console.error('Erreur chargement données initiales:', error)
    return {
      products: [],
      users: []
    }
  }
}

// Fonction pour charger les clients depuis l'API
async function loadClients(): Promise<Client[]> {
  try {
    // Demander tous les clients (limite élevée) pour le store
    const response = await fetch('/api/clients?limit=1000&page=1')
    if (!response.ok) {
      throw new Error('Failed to fetch clients')
    }
    const data = await response.json()
    return data.clients || []
  } catch (error) {
    console.error('Erreur chargement clients:', error)
    return []
  }
}

// Fonction pour charger les notifications depuis l'API
async function loadNotifications(): Promise<Notification[]> {
  try {
    const response = await fetch('/api/notifications')
    if (!response.ok) {
      throw new Error('Failed to fetch notifications')
    }
    return await response.json()
  } catch (error) {
    console.error('Erreur chargement notifications:', error)
    return []
  }
}

// Données initiales
let initialProducts: Product[] = []
let initialUsers: User[] = []
let initialSales: Sale[] = []

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      sales: initialSales,
      users: initialUsers,
      clients: [],
      notifications: [],

      // Fonction pour initialiser les données
      initializeData: async () => {
        // Forcer un rechargement complet des données depuis l'API
        // Ne pas utiliser le cache localStorage pour éviter les problèmes de structure
        const data = await loadInitialData()
        
        // Charger les clients séparément avec tous les paramètres
        let clients: Client[] = []
        try {
          const response = await fetch('/api/clients?limit=1000&page=1')
          const result = await response.json()
          clients = result.clients || []
        } catch (e) {
          console.error('Erreur chargement clients:', e)
          clients = []
        }
        
        // Charger les notifications
        let notifications: Notification[] = []
        try {
          const response = await fetch('/api/notifications')
          notifications = await response.json()
        } catch (e) {
          console.error('Erreur chargement notifications:', e)
        }
        
        set({
          products: data.products,
          users: data.users,
          sales: data.sales,
          clients: clients,
          notifications: notifications
        })
      },

      addProduct: async (product) => {
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
          })
          const savedProduct = await response.json()
          set((state) => ({
            products: [...state.products, savedProduct],
          }))
        } catch (error) {
          console.error('Erreur ajout produit:', error)
          throw error
        }
      },

      updateProduct: async (id, updatedProduct) => {
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct),
          })
          const savedProduct = await response.json()
          if (savedProduct) {
            set((state) => ({
              products: state.products.map((p) => (p.id === id ? savedProduct : p)),
            }))
          }
        } catch (error) {
          console.error('Erreur mise à jour produit:', error)
          throw error
        }
      },

      deleteProduct: async (id) => {
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            set((state) => ({
              products: state.products.filter((p) => p.id !== id),
            }))
          }
        } catch (error) {
          console.error('Erreur suppression produit:', error)
          throw error
        }
      },

      addSale: async (sale) => {
        try {
          const response = await fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sale),
          })
          const savedSale = await response.json()
          set((state) => ({
            sales: [...state.sales, savedSale],
          }))
        } catch (error) {
          console.error('Erreur ajout vente:', error)
          throw error
        }
      },

      updateStock: async (productId, quantity) => {
        const currentProducts = get().products
        const product = currentProducts.find(p => p.id === productId)
        
        if (!product) return

        try {
          await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quantite_stock: product.quantite_stock + quantity
            }),
          })

          set((state) => ({
            products: state.products.map((p) =>
              p.id === productId ? { ...p, quantite_stock: p.quantite_stock + quantity } : p
            ),
          }))
        } catch (error) {
          console.error('Erreur mise à jour stock:', error)
          throw error
        }
      },

      getUsers: () => get().users,

      // Clients
      addClient: async (client) => {
        try {
          const response = await fetch('/api/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
          })
          const savedClient = await response.json()
          set((state) => ({
            clients: [...state.clients, savedClient],
          }))
        } catch (error) {
          console.error('Erreur ajout client:', error)
          throw error
        }
      },

      updateClient: async (id, client) => {
        try {
          const response = await fetch(`/api/clients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
          })
          const updatedClient = await response.json()
          if (updatedClient) {
            set((state) => ({
              clients: state.clients.map((c) => (c.id === id ? updatedClient : c)),
            }))
          }
        } catch (error) {
          console.error('Erreur mise à jour client:', error)
          throw error
        }
      },

      deleteClient: async (id) => {
        try {
          const response = await fetch(`/api/clients/${id}`, {
            method: 'DELETE',
          })
          if (response.ok) {
            set((state) => ({
              clients: state.clients.filter((c) => c.id !== id),
            }))
          }
        } catch (error) {
          console.error('Erreur suppression client:', error)
          throw error
        }
      },

      // Notifications
      addNotification: async (notification) => {
        try {
          const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notification),
          })
          const savedNotification = await response.json()
          set((state) => ({
            notifications: [savedNotification, ...state.notifications],
          }))
        } catch (error) {
          console.error('Erreur ajout notification:', error)
          throw error
        }
      },

      markNotificationRead: async (id, lu) => {
        try {
          const response = await fetch('/api/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, lu }),
          })
          const updatedNotification = await response.json()
          if (updatedNotification) {
            set((state) => ({
              notifications: state.notifications.map((n) => 
                n.id === id ? { ...n, lu } : n
              ),
            }))
          }
        } catch (error) {
          console.error('Erreur mise à jour notification:', error)
          throw error
        }
      },

      sendRestockNotification: async (products, sendToAll, targetClientIds) => {
        try {
          const response = await fetch('/api/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              products,
              sendToAll,
              targetClientIds,
              envoyePar: 'Administrateur'
            }),
          })
          const result = await response.json()
          if (result.success) {
            set((state) => ({
              notifications: [result.notification, ...state.notifications],
            }))
          }
        } catch (error) {
          console.error('Erreur envoi notification restock:', error)
          throw error
        }
      },
    }),
    {
      name: "fish-shop-storage",
      // Migration pour nettoyer les données périmées du cache localStorage
      migrate: (persistedState: any, version) => {
        if (version === 0 || !persistedState) {
          return {
            ...persistedState,
            clients: [] // Force un rechargement des clients
          }
        }
        return persistedState
      },
      version: 1
    },
  ),
)
