import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { DataFile, Notification, CreateNotificationDTO } from '@/lib/types'

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

// GET - Récupérer toutes les notifications
export async function GET() {
  try {
    const data = await readDataFile()
    // Trier par date décroissante
    const notifications = [...data.notifications].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Erreur récupération notifications:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notifications' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle notification
export async function POST(request: NextRequest) {
  try {
    const newNotification: CreateNotificationDTO = await request.json()
    const data = await readDataFile()

    // Validation des champs requis
    if (!newNotification.titre || !newNotification.message || !newNotification.type) {
      return NextResponse.json(
        { error: 'Le titre, le message et le type sont requis' },
        { status: 400 }
      )
    }

    // Déterminer les destinataires selon le type
    let destinatairesIds: number[] = []
    let destinatairesType: 'all' | 'cibles' = newNotification.destinataires_type

    if (newNotification.destinataires_type === 'all') {
      // Tous les clients actifs
      destinatairesIds = data.clients
        .filter(c => c.actif)
        .map(c => c.id)
    } else if (newNotification.destinataires_type === 'cibles' && newNotification.destinataires_ids) {
      destinatairesIds = newNotification.destinataires_ids
    }

    // Générer un nouvel ID
    const newId = data.notifications.length > 0 
      ? Math.max(...data.notifications.map(n => n.id), 0) + 1 
      : 1

    // Créer la notification avec l'ID et les timestamps
    const notification: Notification = {
      id: newId,
      type: newNotification.type,
      titre: newNotification.titre,
      message: newNotification.message,
      produits: newNotification.produits ?? [],
      destinataires_type: destinatairesType,
      destinataires_ids: destinatairesIds,
      envoye_par: 'Administrateur', // À modifier selon l'utilisateur connecté
      created_at: new Date().toISOString(),
      lu: false,
    }

    // Ajouter la notification à la liste
    data.notifications.push(notification)

    // Mettre à jour les métadonnées
    data.migration_info.total_notifications = data.notifications.length

    // Sauvegarder le fichier
    await writeDataFile(data)

    // Dans une vraie application, ici on.enverrait les notifications par email/SMS
    // Pour la démo, on simule juste l'envoi

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la notification' },
      { status: 500 }
    )
  }
}

// PUT - Marquer une notification comme lue
export async function PUT(request: NextRequest) {
  try {
    const { id, lu } = await request.json()
    const data = await readDataFile()
    const notificationId = parseInt(id)
    
    const notificationIndex = data.notifications.findIndex(n => n.id === notificationId)
    
    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: 'Notification non trouvée' },
        { status: 404 }
      )
    }
    
    // Mettre à jour le statut lu
    data.notifications[notificationIndex].lu = lu
    
    // Sauvegarder le fichier
    await writeDataFile(data)
    
    return NextResponse.json(data.notifications[notificationIndex])
  } catch (error) {
    console.error('Erreur mise à jour notification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la notification' },
      { status: 500 }
    )
  }
}
