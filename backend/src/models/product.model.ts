import { Schema, model } from "mongoose"

export type Product = {
  id: number
  nom: string
  categorie: string
  prix_kg: number
  quantite_stock: number
  image: string
  created_at: Date
  updated_at: Date
}

const productSchema = new Schema<Product>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    nom: { type: String, required: true, trim: true, index: true },
    categorie: { type: String, required: true, trim: true, index: true },
    prix_kg: { type: Number, required: true, min: 0 },
    quantite_stock: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

productSchema.index({ nom: "text", categorie: "text" })
productSchema.set("toJSON", { transform: (_doc, ret) => (delete (ret as any)._id, ret) })

export const ProductModel = model<Product>("Product", productSchema)
