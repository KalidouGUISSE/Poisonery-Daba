"use client"

import { useState } from "react"
import Image from "next/image"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { PackagePlus, AlertTriangle, Loader2 } from "lucide-react"

export function StockTable() {
  const { products, updateStock } = useStore()
  const { toast } = useToast()
  const [restockDialogOpen, setRestockDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [restockQuantity, setRestockQuantity] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleRestock = async () => {
    if (!selectedProduct || !restockQuantity) return

    const quantity = Number(restockQuantity)
    if (quantity <= 0) {
      toast({
        title: "Quantité invalide",
        description: "La quantité doit être supérieure à 0",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      updateStock(selectedProduct.id, quantity)
      toast({
        title: "Stock mis à jour",
        description: `${quantity} kg ajouté au stock de ${selectedProduct.nom}`,
      })
      setRestockDialogOpen(false)
      setRestockQuantity("")
      setSelectedProductId(null)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openRestockDialog = (productId: number) => {
    setSelectedProductId(productId)
    setRestockDialogOpen(true)
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: "Rupture", variant: "destructive" as const, color: "text-destructive" }
    } else if (quantity < 5) {
      return { label: "Stock faible", variant: "destructive" as const, color: "text-destructive" }
    } else if (quantity < 10) {
      return { label: "Stock moyen", variant: "secondary" as const, color: "text-yellow-500" }
    } else {
      return { label: "Stock bon", variant: "secondary" as const, color: "text-green-500" }
    }
  }

  // Sort products by stock quantity (lowest first)
  const sortedProducts = [...products].sort((a, b) => a.quantite_stock - b.quantite_stock)

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Stock actuel</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucun produit disponible
                </TableCell>
              </TableRow>
            ) : (
              sortedProducts.map((product) => {
                const status = getStockStatus(product.quantite_stock)
                return (
                  <TableRow key={product.id} className="border-border">
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-secondary">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.nom}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.nom}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        {product.categorie}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {product.quantite_stock < 5 && <AlertTriangle className="h-4 w-4 text-destructive" />}
                        <span className={product.quantite_stock < 5 ? "text-destructive font-medium" : "font-medium"}>
                          {product.quantite_stock} kg
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={status.variant} className={status.color}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openRestockDialog(product.id)}>
                        <PackagePlus className="mr-2 h-4 w-4" />
                        Réapprovisionner
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={restockDialogOpen} onOpenChange={setRestockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réapprovisionner le stock</DialogTitle>
            <DialogDescription>Ajoutez du stock pour {selectedProduct?.nom}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Stock actuel</Label>
              <div className="p-3 bg-secondary rounded-lg border border-border">
                <span className="text-lg font-medium">{selectedProduct?.quantite_stock} kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restock-quantity">Quantité à ajouter (kg)</Label>
              <Input
                id="restock-quantity"
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                placeholder="0.0"
                min="0.1"
                step="0.1"
                className="bg-secondary border-border"
                disabled={isLoading}
              />
            </div>

            {restockQuantity && Number(restockQuantity) > 0 && (
              <div className="p-3 bg-accent rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Nouveau stock:</span>
                  <span className="text-lg font-bold">
                    {(selectedProduct?.quantite_stock || 0) + Number(restockQuantity)} kg
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRestockDialogOpen(false)
                setRestockQuantity("")
                setSelectedProductId(null)
              }}
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleRestock}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading || !restockQuantity || Number(restockQuantity) <= 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Confirmer"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
