"use client"

import { useState } from "react"
import Image from "next/image"
import { useStore, useInitializeStore } from "@/lib/store"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Trash2, AlertTriangle } from "lucide-react"

export function ProductTable() {
  const { products, deleteProduct } = useStore()
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Initialiser les données du store
  useInitializeStore()

  const handleDelete = (id: number) => {
    setDeletingId(id)
    deleteProduct(id)
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès",
    })
    setDeletingId(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">Prix/kg</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Aucun produit disponible
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="border-border">
                <TableCell>
                  <div className="relative h-12 w-12 rounded-md overflow-hidden bg-secondary">
                    <Image src={product.image || "/placeholder.svg"} alt={product.nom} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.nom}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {product.categorie}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatPrice(product.prix_kg)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {product.quantite_stock < 5 && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    <span className={product.quantite_stock < 5 ? "text-destructive font-medium" : ""}>
                      {product.quantite_stock} kg
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <ProductForm product={product} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
