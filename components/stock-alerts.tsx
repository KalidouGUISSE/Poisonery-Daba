"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle2 } from "lucide-react"

export function StockAlerts() {
  const { products } = useStore()

  const lowStockProducts = products.filter((p) => p.quantite_stock < 5 && p.quantite_stock > 0)
  const outOfStockProducts = products.filter((p) => p.quantite_stock === 0)

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertes de stock
        </CardTitle>
        <CardDescription>Produits nécessitant un réapprovisionnement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-500">Tous les produits ont un stock suffisant</AlertDescription>
          </Alert>
        ) : (
          <>
            {outOfStockProducts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">Rupture de stock ({outOfStockProducts.length})</h4>
                {outOfStockProducts.map((product) => (
                  <Alert key={product.id} variant="destructive" className="border-destructive/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-medium">{product.nom}</span> - Stock épuisé
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {lowStockProducts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">Stock faible ({lowStockProducts.length})</h4>
                {lowStockProducts.map((product) => (
                  <Alert key={product.id} variant="destructive" className="border-destructive/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-medium">{product.nom}</span> - Seulement {product.quantite_stock} kg restant
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
