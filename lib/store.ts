"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { addProductToFile, updateProductInFile, deleteProductFromFile, addSaleToFile } from "./data-service"
import { useEffect } from "react"
import { ERROR_MESSAGES } from "./error-messages"

// Hook pour initialiser les données
export function useInitializeStore() {
  const initializeData = useStore((state) => state.initializeData)

  useEffect(() => {
    // Initialiser les données au montage du composant
    initializeData()
  }, [initializeData])
}

export interface Product {
  id: number
  nom: string
  categorie: string
  prix_kg: number
  quantite_stock: number
  image: string
  created_at?: string
  updated_at?: string
}

export interface Sale {
  id: number
  produit_id: number
  produit_nom: string
  poids_kg: number
  prix_total: number
  date_vente: string
  vendeur_id: number
  vendeur_nom: string
}

export interface User {
  id: number
  username: string
  role: "admin" | "vendeur"
  nom?: string
}

interface StoreState {
  products: Product[]
  sales: Sale[]
  users: User[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => void
  addSale: (sale: Omit<Sale, "id">) => void
  updateStock: (productId: number, quantity: number) => void
  getUsers: () => User[]
  initializeData: () => Promise<void>
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
      products: data.products.map((product: any) => ({
        id: product.id,
        nom: product.nom,
        categorie: product.categorie,
        prix_kg: product.prix_kg,
        quantite_stock: product.quantite_stock,
        image: product.image,
      })),
      users: data.users.map((user: any) => ({
        id: user.id,
        username: user.username,
        role: user.role as "admin" | "vendeur",
        nom: user.nom,
      })),
      sales: data.sales?.map((sale: any) => ({
        id: sale.id,
        produit_id: sale.produit_id,
        produit_nom: sale.produit_nom,
        poids_kg: sale.poids_kg,
        prix_total: sale.prix_total,
        date_vente: sale.date_vente,
        vendeur_id: sale.vendeur_id,
        vendeur_nom: sale.vendeur_nom,
        created_at: sale.created_at,
      })) || []
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.DATA_LOAD_ERROR, error)
    // Retourner des données par défaut en cas d'erreur
    return {
      products: [],
      users: []
    }
  }
}

// Données initiales (vides par défaut, seront chargées lors de l'initialisation)
let initialProducts: Product[] = []
let initialUsers: User[] = []
let initialSales: any[] = []

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      sales: initialSales,
      users: initialUsers,

      // Fonction pour initialiser les données
      initializeData: async () => {
        const data = await loadInitialData()
        set({
          products: data.products,
          users: data.users,
          sales: data.sales
        })
      },

      addProduct: async (product) => {
        try {
          const savedProduct = await addProductToFile(product)
          set((state) => ({
            products: [...state.products, savedProduct],
          }))
        } catch (error) {
          console.error(ERROR_MESSAGES.PRODUCT_ADD_ERROR, error)
          throw error
        }
      },

      updateProduct: async (id, updatedProduct) => {
        try {
          const savedProduct = await updateProductInFile(id, updatedProduct)
          if (savedProduct) {
            set((state) => ({
              products: state.products.map((p) => (p.id === id ? savedProduct : p)),
            }))
          }
        } catch (error) {
          console.error(ERROR_MESSAGES.PRODUCT_UPDATE_ERROR, error)
          throw error
        }
      },

      deleteProduct: async (id) => {
        try {
          const success = await deleteProductFromFile(id)
          if (success) {
            set((state) => ({
              products: state.products.filter((p) => p.id !== id),
            }))
          }
        } catch (error) {
          console.error(ERROR_MESSAGES.PRODUCT_DELETE_ERROR, error)
          throw error
        }
      },

      addSale: async (sale) => {
        try {
          const savedSale = await addSaleToFile(sale)
          set((state) => ({
            sales: [...state.sales, savedSale],
          }))
        } catch (error) {
          console.error(ERROR_MESSAGES.SALE_ADD_ERROR, error)
          throw error
        }
      },

      updateStock: async (productId, quantity) => {
        try {
          // Mettre à jour le stock dans le fichier
          await updateProductInFile(productId, {
            quantite_stock: get().products.find(p => p.id === productId)!.quantite_stock + quantity
          })

          // Mettre à jour le stock en mémoire
          set((state) => ({
            products: state.products.map((p) =>
              p.id === productId ? { ...p, quantite_stock: p.quantite_stock + quantity } : p,
            ),
          }))
        } catch (error) {
          console.error(ERROR_MESSAGES.STOCK_UPDATE_ERROR, error)
          throw error
        }
      },

      getUsers: () => get().users,
    }),
    {
      name: "fish-shop-storage",
    },
  ),
)
