import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { DataFile, Client, UpdateClientDTO } from '@/lib/types'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'data.json')

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

// GET - Récupérer un client par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await readDataFile()
    const clientId = parseInt(id)
    
    const client = data.clients.find(c => c.id === clientId)
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(client)
  } catch (error) {
    console.error('Erreur récupération client:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du client' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un client
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updateData: UpdateClientDTO = await request.json()
    const data = await readDataFile()
    const clientId = parseInt(id)
    
    const clientIndex = data.clients.findIndex(c => c.id === clientId)
    
    if (clientIndex === -1) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      )
    }
    
    // Mettre à jour le client
    const updatedClient: Client = {
      ...data.clients[clientIndex],
      ...updateData,
      id: clientId, // Garder l'ID original
      updated_at: new Date().toISOString(),
    }
    
    data.clients[clientIndex] = updatedClient
    
    // Sauvegarder le fichier
    await writeDataFile(data)
    
    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error('Erreur mise à jour client:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du client' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await readDataFile()
    const clientId = parseInt(id)
    
    const clientIndex = data.clients.findIndex(c => c.id === clientId)
    
    if (clientIndex === -1) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      )
    }
    
    // Supprimer le client
    data.clients.splice(clientIndex, 1)
    
    // Mettre à jour les métadonnées
    data.migration_info.total_clients = data.clients.length
    
    // Sauvegarder le fichier
    await writeDataFile(data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression client:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du client' },
      { status: 500 }
    )
  }
}
