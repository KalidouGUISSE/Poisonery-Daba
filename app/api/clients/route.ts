import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { DataFile, Client, CreateClientDTO } from '@/lib/types'

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

// GET - Récupérer les clients avec pagination, tri et recherche
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
    let filteredClients = data.clients
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredClients = filteredClients.filter((client: Client) =>
        client.nom.toLowerCase().includes(searchLower) ||
        client.prenom.toLowerCase().includes(searchLower) ||
        client.telephone.includes(search) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.adresse.toLowerCase().includes(searchLower)
      )
    }
    
    // Trier les clients
    filteredClients.sort((a: Client, b: Client) => {
      let aVal: any = a[sortBy as keyof Client]
      let bVal: any = b[sortBy as keyof Client]
      
      // Gérer les chaînes de caractères
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    
    // Calculer la pagination
    const totalClients = filteredClients.length
    const totalPages = Math.ceil(totalClients / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedClients = filteredClients.slice(startIndex, endIndex)
    
    return NextResponse.json({
      clients: paginatedClients,
      pagination: {
        page,
        limit,
        totalClients,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Erreur récupération clients:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clients' },
      { status: 500 }
    )
  }
}

// POST - Ajouter un nouveau client
export async function POST(request: NextRequest) {
  try {
    const newClient: CreateClientDTO = await request.json()
    const data = await readDataFile()

    // Validation des champs requis
    if (!newClient.nom || !newClient.prenom || !newClient.telephone) {
      return NextResponse.json(
        { error: 'Le nom, prénom et téléphone sont requis' },
        { status: 400 }
      )
    }

    // Générer un nouvel ID
    const newId = data.clients.length > 0 
      ? Math.max(...data.clients.map(c => c.id), 0) + 1 
      : 1

    // Créer le client avec l'ID et les timestamps
    const client: Client = {
      ...newClient,
      id: newId,
      actif: newClient.actif ?? true,
      preferences: newClient.preferences ?? [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Ajouter le client à la liste
    data.clients.push(client)

    // Mettre à jour les métadonnées
    data.migration_info.total_clients = data.clients.length

    // Sauvegarder le fichier
    await writeDataFile(data)

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'ajout du client:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du client' },
      { status: 500 }
    )
  }
}
