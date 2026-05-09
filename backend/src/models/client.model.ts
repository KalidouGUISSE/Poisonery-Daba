import { Schema, model } from "mongoose"

export type Client = {
  id: number
  nom: string
  prenom: string
  telephone: string
  email: string
  adresse: string
  preferences: string[]
  actif: boolean
  created_at: Date
  updated_at: Date
}

const clientSchema = new Schema<Client>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    nom: { type: String, required: true, trim: true, index: true },
    prenom: { type: String, required: true, trim: true, index: true },
    telephone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    adresse: { type: String, trim: true, default: "" },
    preferences: { type: [String], default: [] },
    actif: { type: Boolean, default: true, index: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

clientSchema.index({ nom: "text", prenom: "text", telephone: "text", email: "text", adresse: "text" })
clientSchema.set("toJSON", { transform: (_doc, ret) => (delete (ret as any)._id, ret) })

export const ClientModel = model<Client>("Client", clientSchema)
