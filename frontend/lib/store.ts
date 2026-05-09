"use client"

import { create } from "zustand"
import { useEffect } from "react"
import { Product, Sale, User, Client, Notification } from "./types"
import { apiClient } from "./api-client"

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
  isLoading: boolean
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
    const response = await apiClient.get('/api/initial-data')
    if (response.error) {
      throw new Error(response.error)
    }

    const data = response.data
    return {
      products: data?.products || [],
      users: data?.users || [],
      sales: data?.sales || [],
      clients: data?.clients || [],
      notifications: data?.notifications || []
    }
  } catch (error) {
    console.error('Erreur chargement données initiales:', error)
    return {
      products: [],
      users: [],
      sales: [],
      clients: [],
      notifications: []
    }
  }
}

// Fonction pour charger les clients depuis l'API
async function loadClients(): Promise<Client[]> {
  try {
    const response = await apiClient.get('/api/clients', { limit: '1000', page: '1' })
    if (response.error) {
      throw new Error(response.error)
    }
    return response.data?.clients || []
  } catch (error) {
    console.error('Erreur chargement clients:', error)
    return []
  }
}

// Fonction pour charger les notifications depuis l'API
async function loadNotifications(): Promise<Notification[]> {
  try {
    const response = await apiClient.get('/api/notifications')
    if (response.error) {
      throw new Error(response.error)
    }
    return response.data || []
  } catch (error) {
    console.error('Erreur chargement notifications:', error)
    return []
  }
}

export const useStore = create<StoreState>()(
  (set, get) => ({
    products: [],
    sales: [],
    users: [],
    clients: [],
    notifications: [],
    isLoading: true,

    // Fonction pour initialiser les données
    initializeData: async () => {
      set({ isLoading: true })
      const data = await loadInitialData()

      set({
        products: data.products,
        users: data.users,
        sales: data.sales,
        clients: data.clients,
        notifications: data.notifications,
        isLoading: false
      })
    },

    addProduct: async (product) => {
      try {
        const response = await apiClient.post('/api/products', product)
        if (response.error) {
          throw new Error(response.error)
        }
        const savedProduct = response.data
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
        const response = await apiClient.put(`/api/products/${id}`, updatedProduct)
        if (response.error) {
          throw new Error(response.error)
        }
        const savedProduct = response.data
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
        const response = await apiClient.delete(`/api/products/${id}`)
        if (response.error) {
          throw new Error(response.error)
        }
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      } catch (error) {
        console.error('Erreur suppression produit:', error)
        throw error
      }
    },

    addSale: async (sale) => {
      try {
        const response = await apiClient.post('/api/sales', sale)
        if (response.error) {
          throw new Error(response.error)
        }
        const savedSale = response.data
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
        const response = await apiClient.put(`/api/products/${productId}`, {
          quantite_stock: product.quantite_stock + quantity
        })
        if (response.error) {
          throw new Error(response.error)
        }

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
        const response = await apiClient.post('/api/clients', client)
        if (response.error) {
          throw new Error(response.error)
        }
        const savedClient = response.data
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
        const response = await apiClient.put(`/api/clients/${id}`, client)
        if (response.error) {
          throw new Error(response.error)
        }
        const updatedClient = response.data
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
        const response = await apiClient.delete(`/api/clients/${id}`)
        if (response.error) {
          throw new Error(response.error)
        }
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        }))
      } catch (error) {
        console.error('Erreur suppression client:', error)
        throw error
      }
    },

    // Notifications
    addNotification: async (notification) => {
      try {
        const response = await apiClient.post('/api/notifications', notification)
        if (response.error) {
          throw new Error(response.error)
        }
        const savedNotification = response.data
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
        const response = await apiClient.put('/api/notifications', { id, lu })
        if (response.error) {
          throw new Error(response.error)
        }
        const updatedNotification = response.data
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
        const response = await apiClient.post('/api/notifications/send', {
          products,
          sendToAll,
          targetClientIds,
          envoyePar: 'Administrateur'
        })
        if (response.error) {
          throw new Error(response.error)
        }
        const result = response.data
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
  })
)
