"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function RecentSales() {
  const { sales } = useStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: fr })
    } catch {
      return dateString
    }
  }

  // Get last 5 sales
  const recentSales = [...sales]
    .sort((a, b) => new Date(b.date_vente).getTime() - new Date(a.date_vente).getTime())
    .slice(0, 5)

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Ventes récentes
        </CardTitle>
        <CardDescription>Les 5 dernières transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {recentSales.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Aucune vente enregistrée</div>
        ) : (
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{sale.produit_nom}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {sale.poids_kg} kg
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(sale.date_vente)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatPrice(sale.prix_total)}</p>
                  <p className="text-xs text-muted-foreground">{sale.vendeur_nom}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
