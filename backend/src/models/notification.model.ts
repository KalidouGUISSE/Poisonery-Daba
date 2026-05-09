import { Schema, model } from "mongoose"

export type NotificationType = "restock" | "promotion" | "manual"
export type DestinatairesType = "all" | "cibles"

export type Notification = {
  id: number
  type: NotificationType
  titre: string
  message: string
  produits: string[]
  destinataires_type: DestinatairesType
  destinataires_ids: number[]
  envoye_par: string
  created_at: Date
  lu: boolean
}

const notificationSchema = new Schema<Notification>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    type: { type: String, enum: ["restock", "promotion", "manual"], required: true, index: true },
    titre: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    produits: { type: [String], default: [] },
    destinataires_type: { type: String, enum: ["all", "cibles"], required: true },
    destinataires_ids: { type: [Number], default: [] },
    envoye_par: { type: String, required: true, trim: true },
    created_at: { type: Date, default: Date.now, index: true },
    lu: { type: Boolean, default: false },
  },
  { versionKey: false }
)

notificationSchema.set("toJSON", { transform: (_doc, ret) => (delete (ret as any)._id, ret) })

export const NotificationModel = model<Notification>("Notification", notificationSchema)
