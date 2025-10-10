"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useStore, useInitializeStore, type Product } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Plus, Loader2 } from "lucide-react"
import { ERROR_MESSAGES } from "@/lib/error-messages"

interface ProductFormProps {
  product?: Product
  onSuccess?: () => void
}

const categories = ["Poisson frais", "Poisson congelé", "Poisson séché", "Fruits de mer", "Crustacés"]

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: product?.nom || "",
    categorie: product?.categorie || "",
    prix_kg: product?.prix_kg || 0,
    quantite_stock: product?.quantite_stock || 0,
    image: product?.image || "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const { addProduct, updateProduct } = useStore()
  const { toast } = useToast()

  // Initialiser les données du store
  useInitializeStore()

  const validateForm = () => {
    const errors: {[key: string]: string} = {}

    if (!formData.nom.trim()) {
      errors.nom = ERROR_MESSAGES.MISSING_PRODUCT_NAME
    }

    if (!formData.categorie.trim()) {
      errors.categorie = ERROR_MESSAGES.MISSING_CATEGORY
    }

    if (!formData.prix_kg || formData.prix_kg <= 0) {
      errors.prix_kg = ERROR_MESSAGES.INVALID_PRICE
    }

    if (formData.quantite_stock < 0) {
      errors.quantite_stock = ERROR_MESSAGES.INVALID_STOCK
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation personnalisée
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)

      // Afficher le premier message d'erreur comme toast principal
      const firstError = Object.values(validationErrors)[0]
      toast({
        title: "Informations manquantes",
        description: firstError,
        variant: "destructive",
      })
      return
    }

    // Effacer les erreurs précédentes si validation réussie
    setFieldErrors({})

    setIsLoading(true)

    try {
      if (product) {
        await updateProduct(product.id, formData)
        toast({
          title: "Produit modifié",
          description: "Le produit a été modifié avec succès",
        })
      } else {
        // Gérer l'upload du fichier image
        let imageUrl = formData.image

        if (selectedFile) {
          // Créer un nom de fichier unique
          const fileExtension = selectedFile.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`

          // Créer une URL d'objet pour l'aperçu temporaire
          imageUrl = `/${fileName}`

          // Note: Dans un environnement de production, vous utiliseriez une API route
          // pour uploader le fichier côté serveur. Pour l'instant, nous stockons
          // juste le nom du fichier et l'image sera gérée côté serveur si nécessaire.
        } else {
          // Utiliser une image par défaut si aucune image n'est sélectionnée
          imageUrl = `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(formData.nom + " fish")}`
        }

        await addProduct({ ...formData, image: imageUrl })
        toast({
          title: "Produit ajouté",
          description: "Le produit a été ajouté avec succès",
        })
      }

      setOpen(false)
      onSuccess?.()

      if (!product) {
        setFormData({
          nom: "",
          categorie: "",
          prix_kg: 0,
          quantite_stock: 0,
          image: "",
        })
        setSelectedFile(null)
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      toast({
        title: ERROR_MESSAGES.OPERATION_FAILED,
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="ghost" size="sm">
            Modifier
          </Button>
        ) : (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
          <DialogDescription>
            {product ? "Modifiez les informations du produit" : "Ajoutez un nouveau produit à votre catalogue"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du produit</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => {
                setFormData({ ...formData, nom: e.target.value })
                // Effacer l'erreur du champ quand l'utilisateur tape
                if (fieldErrors.nom) {
                  setFieldErrors({ ...fieldErrors, nom: "" })
                }
              }}
              placeholder="Ex: Thiof, Dorade..."
              className={`bg-secondary border-border ${fieldErrors.nom ? 'border-destructive focus:border-destructive' : ''}`}
            />
            {fieldErrors.nom && (
              <p className="text-sm text-destructive">{fieldErrors.nom}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categorie">Catégorie</Label>
            <Select
              value={formData.categorie}
              onValueChange={(value) => {
                setFormData({ ...formData, categorie: value })
                // Effacer l'erreur du champ quand l'utilisateur sélectionne
                if (fieldErrors.categorie) {
                  setFieldErrors({ ...fieldErrors, categorie: "" })
                }
              }}
            >
              <SelectTrigger className={`bg-secondary border-border ${fieldErrors.categorie ? 'border-destructive focus:border-destructive' : ''}`}>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.categorie && (
              <p className="text-sm text-destructive">{fieldErrors.categorie}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prix_kg">Prix/kg (FCFA)</Label>
              <Input
                id="prix_kg"
                type="number"
                value={formData.prix_kg}
                onChange={(e) => {
                  setFormData({ ...formData, prix_kg: Number(e.target.value) })
                  // Effacer l'erreur du champ quand l'utilisateur tape
                  if (fieldErrors.prix_kg) {
                    setFieldErrors({ ...fieldErrors, prix_kg: "" })
                  }
                }}
                placeholder="2500"
                min="0"
                className={`bg-secondary border-border ${fieldErrors.prix_kg ? 'border-destructive focus:border-destructive' : ''}`}
              />
              {fieldErrors.prix_kg && (
                <p className="text-sm text-destructive">{fieldErrors.prix_kg}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantite_stock">Stock (kg)</Label>
              <Input
                id="quantite_stock"
                type="number"
                value={formData.quantite_stock}
                onChange={(e) => {
                  setFormData({ ...formData, quantite_stock: Number(e.target.value) })
                  // Effacer l'erreur du champ quand l'utilisateur tape
                  if (fieldErrors.quantite_stock) {
                    setFieldErrors({ ...fieldErrors, quantite_stock: "" })
                  }
                }}
                placeholder="30"
                min="0"
                step="0.1"
                className={`bg-secondary border-border ${fieldErrors.quantite_stock ? 'border-destructive focus:border-destructive' : ''}`}
              />
              {fieldErrors.quantite_stock && (
                <p className="text-sm text-destructive">{fieldErrors.quantite_stock}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image du produit</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setSelectedFile(file)
                  // Créer une URL d'aperçu temporaire
                  const previewUrl = URL.createObjectURL(file)
                  setFormData({ ...formData, image: previewUrl })
                }
              }}
              className="bg-secondary border-border"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Aperçu"
                  className="w-20 h-20 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : product ? (
                "Modifier"
              ) : (
                "Ajouter"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
