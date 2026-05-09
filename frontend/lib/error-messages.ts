// Messages d'erreur centralisés pour l'application Fish Shop
export const ERROR_MESSAGES = {
  // Erreurs de fichiers
  FILE_READ_ERROR: "Erreur lors de la lecture du fichier data.json",
  FILE_WRITE_ERROR: "Erreur lors de l'écriture du fichier data.json",
  FILE_NOT_FOUND: "Fichier de données introuvable",
  FILE_CORRUPTED: "Fichier de données corrompu",

  // Erreurs de produits
  PRODUCT_ADD_ERROR: "Erreur lors de l'ajout du produit",
  PRODUCT_UPDATE_ERROR: "Erreur lors de la mise à jour du produit",
  PRODUCT_DELETE_ERROR: "Erreur lors de la suppression du produit",
  PRODUCT_NOT_FOUND: "Produit non trouvé",
  PRODUCT_FETCH_ERROR: "Erreur lors de la récupération des produits",

  // Erreurs de ventes
  SALE_ADD_ERROR: "Erreur lors de l'ajout de la vente",
  SALE_FETCH_ERROR: "Erreur lors de la récupération des ventes",

  // Erreurs de stock
  STOCK_UPDATE_ERROR: "Erreur lors de la mise à jour du stock",
  INSUFFICIENT_STOCK: "Stock insuffisant",

  // Erreurs d'images
  IMAGE_SAVE_ERROR: "Erreur lors de la sauvegarde de l'image",
  IMAGE_UPLOAD_ERROR: "Impossible de télécharger l'image",

  // Erreurs de données
  DATA_LOAD_ERROR: "Erreur lors du chargement des données initiales",
  DATA_INITIALIZATION_ERROR: "Erreur lors de l'initialisation des données",

  // Erreurs d'authentification
  AUTH_ERROR: "Erreur d'authentification",
  UNAUTHORIZED: "Accès non autorisé",

  // Erreurs réseau
  NETWORK_ERROR: "Erreur de connexion réseau",
  SERVER_ERROR: "Erreur du serveur",

  // Erreurs de validation
  INVALID_DATA: "Données invalides",
  MISSING_FIELDS: "Champs obligatoires manquants",
  MISSING_PRODUCT_NAME: "Le nom du produit est obligatoire",
  MISSING_CATEGORY: "La catégorie est obligatoire",
  INVALID_PRICE: "Le prix au kg doit être supérieur à 0",
  INVALID_STOCK: "La quantité en stock doit être supérieure ou égale à 0",

  // Erreurs génériques
  UNKNOWN_ERROR: "Erreur inconnue",
  OPERATION_FAILED: "Opération échouée",
} as const

// Types pour les erreurs
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES
export type ErrorMessageValue = typeof ERROR_MESSAGES[ErrorMessageKey]

// Fonction utilitaire pour récupérer un message d'erreur
export function getErrorMessage(key: ErrorMessageKey): string {
  return ERROR_MESSAGES[key]
}

// Fonction pour créer un message d'erreur avec contexte
export function createErrorMessage(key: ErrorMessageKey, context?: string): string {
  const baseMessage = ERROR_MESSAGES[key]
  return context ? `${baseMessage}: ${context}` : baseMessage
}