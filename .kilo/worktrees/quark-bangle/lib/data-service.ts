import { Product } from './store'

const API_BASE_URL = '/api/products'

// Fonction utilitaire pour gérer les erreurs
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
  }
  return response.json()
}

export async function addProductToFile(newProduct: Omit<Product, 'id'>): Promise<Product> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error)
    throw error
  }
}

export async function updateProductInFile(id: number, updatedProduct: Partial<Product>): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    throw error
  }
}

export async function deleteProductFromFile(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })

    await handleApiResponse(response)
    return true
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
    return false
  }
}

// Fonction pour ajouter une vente
export async function addSaleToFile(newSale: any): Promise<any> {
  try {
    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSale),
    })

    return await handleApiResponse(response)
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la vente:', error)
    throw error
  }
}

// Fonction pour sauvegarder l'image côté client
export async function saveImageFile(file: File): Promise<string> {
  try {
    // Créer un nom de fichier unique
    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    const publicPath = `/public/${fileName}`

    // Dans un environnement réel, vous utiliseriez une API route pour l'upload
    // Pour l'instant, nous retournons juste le nom du fichier
    // L'image sera sauvegardée côté serveur via l'API si nécessaire

    return `/${fileName}`
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'image:', error)
    throw new Error('Impossible de sauvegarder l\'image')
  }
}