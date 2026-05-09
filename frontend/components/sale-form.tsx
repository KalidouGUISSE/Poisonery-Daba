"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { ERROR_MESSAGES } from "@/lib/error-messages"
import { ShoppingCart, Loader2, Plus, Trash2 } from "lucide-react"

interface SaleItem {
  id: string
  productId: string
  poids: string
}

export function SaleForm() {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([{ id: crypto.randomUUID(), productId: "", poids: "" }])
  const [isLoading, setIsLoading] = useState(false)

  const { products, addSale, updateStock } = useStore()
  const { user } = useAuth()
  const { toast } = useToast()

  const availableProducts = products.filter((p) => p.quantite_stock > 0)

  // Calculer le prix total pour chaque article
  const calculateItemTotal = (item: SaleItem) => {
    const product = products.find((p) => p.id === Number(item.productId))
    if (!product || !item.poids) return 0
    return product.prix_kg * Number(item.poids)
  }

  // Calculer le prix total de la vente
  const totalVente = saleItems.reduce((sum, item) => sum + calculateItemTotal(item), 0)

  // Ajouter un nouvel article
  const addSaleItem = () => {
    setSaleItems([...saleItems, { id: crypto.randomUUID(), productId: "", poids: "" }])
  }

  // Supprimer un article
  const removeSaleItem = (index: number) => {
    if (saleItems.length > 1) {
      setSaleItems(saleItems.filter((_, i) => i !== index))
    }
  }

  // Mettre à jour un article
  const updateSaleItem = (index: number, field: keyof SaleItem, value: string) => {
    const newItems = [...saleItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setSaleItems(newItems)
  }

  // Vérifier si tous les articles sont valides
  const isValidSale = () => {
    return saleItems.every((item) => {
      const product = products.find((p) => p.id === Number(item.productId))
      const poids = Number(item.poids)
      return product && poids > 0 && poids <= product.quantite_stock
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !isValidSale()) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un produit avec une quantité valide",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const salesData = saleItems
        .filter((item) => item.productId && item.poids)
        .map((item) => {
          const product = products.find((p) => p.id === Number(item.productId))!
          const poidsNum = Number(item.poids)
          return {
            produit_id: product.id,
            produit_nom: product.nom,
            poids_kg: poidsNum,
            prix_total: product.prix_kg * poidsNum,
            date_vente: new Date().toISOString(),
            vendeur_id: user.id,
            vendeur_nom: user.nom || user.username,
          }
        })

      if (salesData.length === 0) {
        throw new Error("Aucun produit à vendre")
      }

      // Envoyer toutes les ventes en une seule requête
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: salesData }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement")
      }

      // Ajouter la vente au store pour mettre à jour l'historique
      const savedSales = await response.json()
      
      // L'API retourne soit un tableau soit un objet unique
      if (Array.isArray(savedSales)) {
        for (const sale of savedSales) {
          await addSale(sale)
        }
      } else if (savedSales) {
        await addSale(savedSales)
      }

      // Mettre à jour le stock pour chaque produit
      for (const item of saleItems) {
        if (item.productId && item.poids) {
          await updateStock(Number(item.productId), -Number(item.poids))
        }
      }

      const totalKg = salesData.reduce((sum, s) => sum + s.poids_kg, 0)
      toast({
        title: "Vente enregistrée",
        description: `${totalKg.toFixed(1)} kg de produits vendus pour ${formatPrice(totalVente)}`,
      })

      // Réinitialiser le formulaire
      setSaleItems([{ id: crypto.randomUUID(), productId: "", poids: "" }])
    } catch (error) {
      console.error("Erreur:", error)
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
          {/* Liste des produits */}
          <div className="space-y-3">
            {saleItems.map((item, index) => {
              const product = products.find((p) => p.id === Number(item.productId))
              const itemTotal = calculateItemTotal(item)

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-2 p-3 bg-secondary/30 rounded-lg border border-border"
                >
                  {/* Sélection du produit */}
                  <div className="flex-1">
                    <Select
                      key={`select-${item.id}`}
                      value={item.productId}
                      onValueChange={(value) => updateSaleItem(index, "productId", value)}
                      required
                      disabled={isLoading || availableProducts.length === 0}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Sélectionnez un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            Aucun produit en stock
                          </div>
                        ) : (
                          availableProducts.map((product) => (
                            <SelectItem key={product.id} value={String(product.id)}>
                              {product.nom} - {formatPrice(product.prix_kg)}/kg
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {product && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Stock: {product.quantite_stock} kg
                      </p>
                    )}
                  </div>

                  {/* Champ de poids */}
                  <div className="w-full sm:w-24">
                    <Input
                      type="number"
                      value={item.poids}
                      onChange={(e) => updateSaleItem(index, "poids", e.target.value)}
                      placeholder="Kg"
                      required
                      min="0.1"
                      step="0.1"
                      max={product?.quantite_stock}
                      disabled={isLoading || !item.productId}
                      className="bg-secondary border-border"
                    />
                  </div>

                  {/* Prix total de l'article */}
                  <div className="w-full sm:w-28 text-right">
                    <div className="text-sm font-medium text-primary">
                      {itemTotal > 0 ? formatPrice(itemTotal) : "-"}
                    </div>
                  </div>

                  {/* Bouton de suppression */}
                  <div className="sm:w-10">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSaleItem(index)}
                      disabled={isLoading || saleItems.length === 1}
                      className="w-full text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bouton ajouter un produit */}
          <Button
            type="button"
            variant="outline"
            onClick={addSaleItem}
            disabled={isLoading}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Button>

          {/* Prix total */}
          {totalVente > 0 && (
            <div className="p-4 bg-accent rounded-lg border border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-2xl font-bold">{formatPrice(totalVente)}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading || !isValidSale() || totalVente === 0}
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
