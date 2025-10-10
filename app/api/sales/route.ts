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

// POST - Ajouter une nouvelle vente
export async function POST(request: NextRequest) {
  try {
    const newSale = await request.json()
    const data = await readDataFile()

    // Générer un nouvel ID
    const newId = Math.max(...data.sales.map((s: any) => s.id), 0) + 1

    // Créer la vente avec l'ID et les timestamps
    const sale = {
      ...newSale,
      id: newId,
      created_at: new Date().toISOString(),
    }

    // Ajouter la vente à la liste
    data.sales.push(sale)

    // Mettre à jour les métadonnées
    data.metadata.created_at = new Date().toISOString()
    data.migration_info.total_sales = data.sales.length

    // Sauvegarder le fichier
    await writeDataFile(data)

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la vente:', error)
    return NextResponse.json(
      { error: ERROR_MESSAGES.SALE_ADD_ERROR },
      { status: 500 }
    )
  }
}