import { Schema, model } from "mongoose"

export type Sale = {
  id: number
  produit_id: number
  produit_nom: string
  poids_kg: number
  prix_total: number
  date_vente: Date
  vendeur_id: number
  vendeur_nom: string
  created_at: Date
}

const saleSchema = new Schema<Sale>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    produit_id: { type: Number, required: true, index: true },
    produit_nom: { type: String, required: true, trim: true },
    poids_kg: { type: Number, required: true, min: 0.1 },
    prix_total: { type: Number, required: true, min: 0 },
    date_vente: { type: Date, required: true, default: Date.now, index: true },
    vendeur_id: { type: Number, required: true, index: true },
    vendeur_nom: { type: String, required: true, trim: true },
    created_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

saleSchema.set("toJSON", { transform: (_doc, ret) => (delete (ret as any)._id, ret) })

export const SaleModel = model<Sale>("Sale", saleSchema)
