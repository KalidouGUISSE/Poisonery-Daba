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
import { Trash2, AlertTriangle, Edit2 } from "lucide-react"

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

  const formatPrice = (price: number) => new Intl.NumberFormat("fr-FR").format(price) + " $"

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 border-border hover:bg-transparent">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden md:table-cell">Catégorie</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Prix/kg</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Aucun produit disponible</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="border-border hover:bg-secondary/30 transition-colors">
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-secondary">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.nom}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.nom}</div>
                    <div className="md:hidden text-sm text-muted-foreground">
                      {product.categorie}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className="bg-secondary/50">
                      {product.categorie}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell font-medium">
                    {formatPrice(product.prix_kg)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {product.quantite_stock < 5 && (
                        <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                      )}
                      <span
                        className={`font-medium ${
                          product.quantite_stock < 5
                            ? "text-destructive"
                            : product.quantite_stock < 10
                            ? "text-warning"
                            : ""
                        }`}
                      >
                        {product.quantite_stock} kg
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <ProductForm product={product} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer \"{product.nom}\" ? Cette action est irréversible.
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
    </div>
  )
}
