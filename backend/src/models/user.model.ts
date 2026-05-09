import { Schema, model, type HydratedDocument } from "mongoose"

export type UserRole = "admin" | "vendeur"

export type User = {
  id: number
  username: string
  password_hash: string
  role: UserRole
  nom?: string
  created_at: Date
  updated_at: Date
}

export type UserDocument = HydratedDocument<User>

const userSchema = new Schema<User>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password_hash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "vendeur"], default: "vendeur", index: true },
    nom: { type: String, trim: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete (ret as any)._id
    delete (ret as any).password_hash
    return ret
  },
})

export const UserModel = model<User>("User", userSchema)
