import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { DataFile, Notification } from '@/lib/types'

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

// POST - Envoyer une notification de réapprovisionnement
export async function POST(request: NextRequest) {
  try {
    const { products, sendToAll, targetClientIds, envoyePar } = await request.json()
    const data = await readDataFile()

    // Validation
    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Au moins un produit doit être spécifié' },
        { status: 400 }
      )
    }

    // Trouver les clients ciblés
    let destinatairesIds: number[] = []

    if (sendToAll) {
      // Tous les clients actifs
      destinatairesIds = data.clients
        .filter(c => c.actif)
        .map(c => c.id)
    } else if (targetClientIds && targetClientIds.length > 0) {
      // Clients dont les préférences correspondent aux produits réapprovisionnés
      const produitsNoms = products.map((p: any) => p.nom)
      
      destinatairesIds = data.clients
        .filter(c => c.actif && c.preferences.some(pref => produitsNoms.includes(pref)))
        .map(c => c.id)
    } else {
      // Par défaut, envoyer à tous
      destinatairesIds = data.clients
        .filter(c => c.actif)
        .map(c => c.id)
    }

    // Si aucun destinataire, ne pas envoyer
    if (destinatairesIds.length === 0) {
      return NextResponse.json(
        { error: 'Aucun client ciblé pour cette notification' },
        { status: 400 }
      )
    }

    // Générer un nouvel ID
    const newId = data.notifications.length > 0 
      ? Math.max(...data.notifications.map(n => n.id), 0) + 1 
      : 1

    // Créer le message
    const produitsStr = products.map((p: any) => p.nom).join(', ')
    const notification: Notification = {
      id: newId,
      type: 'restock',
      titre: 'Nouveau stock disponible 🐟',
      message: `Nous avons réapprovisionné notre stock avec : ${produitsStr}.Venez découvrir notre sélection fraîche!`,
      produits: products.map((p: any) => p.nom),
      destinataires_type: sendToAll ? 'all' : 'cibles',
      destinataires_ids: destinatairesIds,
      envoye_par: envoyePar || 'Administrateur',
      created_at: new Date().toISOString(),
      lu: false,
    }

    // Ajouter la notification à la liste
    data.notifications.push(notification)

    // Mettre à jour les métadonnées
    data.migration_info.total_notifications = data.notifications.length

    // Sauvegarder le fichier
    await writeDataFile(data)

    return NextResponse.json({
      success: true,
      notification,
      destinatairesCount: destinatairesIds
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la notification' },
      { status: 500 }
    )
  }
}
