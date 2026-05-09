// Types pour les produits (réutilisés depuis le projet)
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

// Types pour les utilisateurs
export interface User {
  id: number
  username: string
  role: "admin" | "vendeur"
  nom?: string
  created_at?: string
}

// Types pour les ventes
export interface Sale {
  id: number
  produit_id: number
  produit_nom: string
  poids_kg: number
  prix_total: number
  date_vente: string
  vendeur_id: number
  vendeur_nom: string
  created_at?: string
}

// Types pour les clients
export interface Client {
  id: number
  nom: string
  prenom: string
  telephone: string
  email: string
  adresse: string
  preferences: string[]
  actif: boolean
  created_at: string
  updated_at: string
}

export interface CreateClientDTO {
  nom: string
  prenom: string
  telephone: string
  email: string
  adresse: string
  preferences: string[]
  actif?: boolean
}

export interface UpdateClientDTO {
  nom?: string
  prenom?: string
  telephone?: string
  email?: string
  adresse?: string
  preferences?: string[]
  actif?: boolean
}

// Types pour les notifications
export type NotificationType = 'restock' | 'promotion' | 'manual'
export type DestinatairesType = 'all' | 'cibles'

export interface Notification {
  id: number
  type: NotificationType
  titre: string
  message: string
  produits: string[]
  destinataires_type: DestinatairesType
  destinataires_ids: number[]
  envoye_par: string
  created_at: string
  lu: boolean
}

export interface CreateNotificationDTO {
  type: NotificationType
  titre: string
  message: string
  produits?: string[]
  destinataires_type: DestinatairesType
  destinataires_ids?: number[]
}

// Type pour les données du fichier JSON
export interface DataFile {
  metadata: {
    version: string
    created_at: string
    description: string
    tables: string[]
  }
  users: any[]
  products: any[]
  sales: any[]
  clients: Client[]
  notifications: Notification[]
  migration_info: {
    total_users: number
    total_products: number
    total_sales: number
    total_clients: number
    total_notifications: number
    estimated_migration_time: string
    dependencies: string[]
    post_migration_steps: string[]
  }
}
