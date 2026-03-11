"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { ERROR_MESSAGES } from "@/lib/error-messages"
import { ShoppingCart, Loader2 } from "lucide-react"

export function SaleForm() {
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [poids, setPoids] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const { products, addSale, updateStock } = useStore()
  const { user } = useAuth()
  const { toast } = useToast()

  const selectedProduct = products.find((p) => p.id === Number(selectedProductId))
  const prixTotal = selectedProduct && poids ? selectedProduct.prix_kg * Number(poids) : 0

  const availableProducts = products.filter((p) => p.quantite_stock > 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct || !user) return

    const poidsNum = Number(poids)

    if (poidsNum > selectedProduct.quantite_stock) {
      toast({
        title: ERROR_MESSAGES.INSUFFICIENT_STOCK,
        description: `Stock disponible: ${selectedProduct.quantite_stock} kg`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Add sale and update stock atomically
      const saleData = {
        produit_id: selectedProduct.id,
        produit_nom: selectedProduct.nom,
        poids_kg: poidsNum,
        prix_total: prixTotal,
        date_vente: new Date().toISOString(),
        vendeur_id: user.id,
        vendeur_nom: user.nom || user.username,
      }

      // Add sale first
      await addSale(saleData)

      // Update stock after sale is successfully saved
      await updateStock(selectedProduct.id, -poidsNum)

      toast({
        title: "Vente enregistrée",
        description: `${poidsNum} kg de ${selectedProduct.nom} vendu pour ${formatPrice(prixTotal)}`,
      })

      // Reset form
      setSelectedProductId("")
      setPoids("")
    } catch (error) {
      toast({
        title: ERROR_MESSAGES.OPERATION_FAILED,
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Nouvelle vente
        </CardTitle>
        <CardDescription>Enregistrez une vente de poisson au kilo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produit</Label>
            <Select
              value={selectedProductId}
              onValueChange={setSelectedProductId}
              required
              disabled={isLoading || availableProducts.length === 0}
            >
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Sélectionnez un produit" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucun produit en stock</div>
                ) : (
                  availableProducts.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.nom} - {formatPrice(product.prix_kg)}/kg (Stock: {product.quantite_stock} kg)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="poids">Poids (kg)</Label>
            <Input
              id="poids"
              type="number"
              value={poids}
              onChange={(e) => setPoids(e.target.value)}
              placeholder="0.0"
              required
              min="0.1"
              step="0.1"
              max={selectedProduct?.quantite_stock}
              disabled={isLoading || !selectedProductId}
              className="bg-secondary border-border"
            />
            {selectedProduct && (
              <p className="text-xs text-muted-foreground">Stock disponible: {selectedProduct.quantite_stock} kg</p>
            )}
          </div>

          {prixTotal > 0 && (
            <div className="p-4 bg-accent rounded-lg border border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Prix total:</span>
                <span className="text-2xl font-bold">{formatPrice(prixTotal)}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading || !selectedProductId || !poids || Number(poids) <= 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer la vente"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
