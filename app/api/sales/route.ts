import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { ERROR_MESSAGES } from '@/lib/error-messages'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'data.json')

interface DataFile {
  metadata: {
    version: string
    created_at: string
    description: string
    tables: string[]
  }
  users: any[]
  products: any[]
  sales: any[]
  migration_info: any
}

async function readDataFile(): Promise<DataFile> {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(ERROR_MESSAGES.FILE_READ_ERROR, error)
    throw new Error(ERROR_MESSAGES.FILE_NOT_FOUND)
  }
}

async function writeDataFile(data: DataFile): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error(ERROR_MESSAGES.FILE_WRITE_ERROR, error)
    throw new Error(ERROR_MESSAGES.FILE_NOT_FOUND)
  }
}

// POST - Ajouter une nouvelle vente (plusieurs produits)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await readDataFile()

    // Accepter soit un tableau de produits soit un seul produit
    const products = Array.isArray(body.products) ? body.products : [body]
    
    const createdSales = []
    
    for (const product of products) {
      // Générer un nouvel ID pour chaque vente
      const newId = Math.max(...data.sales.map((s: any) => s.id), 0) + 1

      // Créer la vente avec l'ID et les timestamps
      const sale = {
        produit_id: product.produit_id,
        produit_nom: product.produit_nom,
        poids_kg: product.poids_kg,
        prix_total: product.prix_total,
        date_vente: product.date_vente || new Date().toISOString(),
        vendeur_id: product.vendeur_id,
        vendeur_nom: product.vendeur_nom,
        id: newId,
        created_at: new Date().toISOString(),
      }

      // Ajouter la vente à la liste
      data.sales.push(sale)
      createdSales.push(sale)
    }

    // Mettre à jour les métadonnées
    data.metadata.created_at = new Date().toISOString()
    data.migration_info.total_sales = data.sales.length

    // Sauvegarder le fichier
    await writeDataFile(data)

    // Retourner un seul objet si un seul produit, sinon un tableau
    return NextResponse.json(
      createdSales.length === 1 ? createdSales[0] : createdSales,
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la vente:', error)
    return NextResponse.json(
      { error: ERROR_MESSAGES.SALE_ADD_ERROR },
      { status: 500 }
    )
  }
}