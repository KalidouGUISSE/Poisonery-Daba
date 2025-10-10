import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'data.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
    const data = JSON.parse(fileContent)

    return NextResponse.json({
      products: data.products,
      users: data.users,
      sales: data.sales
    })
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier data.json:', error)
    return NextResponse.json(
      { error: 'Impossible de lire le fichier de données' },
      { status: 500 }
    )
  }
}