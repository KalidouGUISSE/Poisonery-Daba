// Configuration de l'API
// Permet de basculer entre le mode legacy (API routes Next.js) et le backend Express

export const API_CONFIG = {
  // URL du backend Express (utilisée par le proxy Next.js)
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000',

  // Mode de fonctionnement
  // 'legacy' : utilise les API routes Next.js avec fichier JSON
  // 'backend' : utilise le backend Express avec MongoDB
  MODE: process.env.NEXT_PUBLIC_API_MODE || 'backend',

  // Configuration des timeouts
  TIMEOUT: 10000, // 10 secondes
}

// Helper pour construire les URLs d'API
export const buildApiUrl = (path: string): string => {
  if (API_CONFIG.MODE === 'legacy') {
    return path // Les API routes Next.js sont servies depuis le même domaine
  }
  return `${API_CONFIG.BACKEND_URL}${path}`
}

// Headers par défaut pour les requêtes
export const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // TODO: Ajouter le header Authorization quand l'authentification sera implémentée
  // const token = getAuthToken()
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`
  // }

  return headers
}