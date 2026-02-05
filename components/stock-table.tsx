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
    } catch {
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
      return { label: "Stock moyen", variant: "secondary" as const, color: "text-warning" }
    }
    return { label: "En stock", variant: "secondary" as const, color: "text-success" }
  }

  // Sort products by stock quantity (lowest first)
  const sortedProducts = [...products].sort((a, b) => a.quantite_stock - b.quantite_stock)

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 border-border hover:bg-transparent">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Statut</TableHead>
                <TableHead className="text-right w-[140px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <PackagePlus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">Aucun produit disponible</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedProducts.map((product) => {
                  const status = getStockStatus(product.quantite_stock)
                  return (
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
                          <Badge variant={status.variant} className={status.color}>
                            {status.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="bg-secondary/50">
                          {product.categorie}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {product.quantite_stock} kg
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        <Badge variant={status.variant} className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRestockDialog(product.id)}
                          className="gap-1"
                        >
                          <PackagePlus className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Réappro.</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={restockDialogOpen} onOpenChange={setRestockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Réapprovisionner le stock</DialogTitle>
            <DialogDescription>
              Ajoutez du stock pour <span className="font-medium">{selectedProduct?.nom}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-background">
                <Image
                  src={selectedProduct?.image || "/placeholder.svg"}
                  alt={selectedProduct?.nom || ""}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{selectedProduct?.nom}</p>
                <p className="text-sm text-muted-foreground">
                  Stock actuel: <span className="font-medium">{selectedProduct?.quantite_stock} kg</span>
                </p>
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
                className="input-focus"
                disabled={isLoading}
              />
            </div>

            {restockQuantity && Number(restockQuantity) > 0 && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Nouveau stock:</span>
                  <span className="text-lg font-bold text-primary">
                    {(selectedProduct?.quantite_stock || 0) + Number(restockQuantity)} kg
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
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
              className="flex-1 bg-primary hover:bg-primary/90"
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
