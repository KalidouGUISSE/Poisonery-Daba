import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { Product } from '@/lib/store'
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

// PUT - Mettre à jour un produit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const updatedProduct: Partial<Product> = await request.json()
    const data = await readDataFile()

    const productIndex = data.products.findIndex(p => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.PRODUCT_NOT_FOUND },
        { status: 404 }
      )
    }

    // Mettre à jour le produit
    data.products[productIndex] = {
      ...data.products[productIndex],
      ...updatedProduct,
      updated_at: new Date().toISOString(),
    }

    // Mettre à jour les métadonnées
    data.metadata.created_at = new Date().toISOString()

    // Sauvegarder le fichier
    await writeDataFile(data)

    return NextResponse.json(data.products[productIndex])
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    return NextResponse.json(
      { error: ERROR_MESSAGES.PRODUCT_UPDATE_ERROR },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await readDataFile()

    const initialLength = data.products.length
    data.products = data.products.filter(p => p.id !== id)

    if (data.products.length === initialLength) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour les métadonnées
    data.metadata.created_at = new Date().toISOString()
    data.migration_info.total_products = data.products.length

    // Sauvegarder le fichier
    await writeDataFile(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
    return NextResponse.json(
      { error: ERROR_MESSAGES.PRODUCT_DELETE_ERROR },
      { status: 500 }
    )
  }
}