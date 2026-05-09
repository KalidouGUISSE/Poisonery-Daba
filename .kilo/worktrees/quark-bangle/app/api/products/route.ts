import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { Product } from '@/lib/types'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'data.json')

interface DataFile {
  metadata: {
    version: string
    created_at: string
    description: string
    tables: string[]
  }
  users: any[]
  products: Product[]
  sales: any[]
  clients: any[]
  notifications: any[]
  migration_info: any
}

async function readDataFile(): Promise<DataFile> {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Erreur lecture fichier:', error)
    throw new Error('Impossible de lire le fichier de données')
  }
}

async function writeDataFile(data: DataFile): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Erreur écriture fichier:', error)
    throw new Error("Impossible d'écrire dans le fichier de données")
  }
}

// GET - Récupérer les produits avec pagination, tri et recherche
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Paramètres de tri
    const sortBy = searchParams.get('sortBy') || 'nom'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    
    // Paramètres de recherche
    const search = searchParams.get('search') || ''
    
    const data = await readDataFile()
    
    // Filtrer par recherche
    let filteredProducts = data.products
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter((product: Product) =>
        product.nom.toLowerCase().includes(searchLower) ||
        product.categorie.toLowerCase().includes(searchLower)
      )
    }
    
    // Trier les produits
    filteredProducts.sort((a: Product, b: Product) => {
      let aVal: any = a[sortBy as keyof Product]
      let bVal: any = b[sortBy as keyof Product]
      
      // Gérer les chaînes de caractères
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      // Gérer les nombres
      if (sortBy === 'prix_kg' || sortBy === 'quantite_stock') {
        aVal = Number(aVal)
        bVal = Number(bVal)
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    
    // Calculer la pagination
    const totalProducts = filteredProducts.length
    const totalPages = Math.ceil(totalProducts / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Erreur récupération produits:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}

// POST - Ajouter un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const newProduct: Omit<Product, 'id'> = await request.json()
    const data = await readDataFile()

    // Générer un nouvel ID
    const newId = data.products.length > 0 
      ? Math.max(...data.products.map(p => p.id), 0) + 1 
      : 1

    // Créer le produit avec l'ID et les timestamps
    const product: Product = {
      ...newProduct,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Ajouter le produit à la liste
    data.products.push(product)

    // Mettre à jour les métadonnées
    data.metadata.created_at = new Date().toISOString()
    data.migration_info.total_products = data.products.length

    // Sauvegarder le fichier
    await writeDataFile(data)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du produit' },
      { status: 500 }
    )
  }
}
