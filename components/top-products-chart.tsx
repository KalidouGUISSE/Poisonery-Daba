"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Trophy } from "lucide-react"

export function TopProductsChart() {
  const { sales, products } = useStore()

  // Calculate total quantity sold per product
  const productSales = sales.reduce(
    (acc, sale) => {
      if (!acc[sale.produit_id]) {
        acc[sale.produit_id] = {
          id: sale.produit_id,
          nom: sale.produit_nom,
          quantite: 0,
          revenue: 0,
        }
      }
      acc[sale.produit_id].quantite += sale.poids_kg
      acc[sale.produit_id].revenue += sale.prix_total
      return acc
    },
    {} as Record<number, { id: number; nom: string; quantite: number; revenue: number }>,
  )

  // Get top 5 products by quantity sold
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantite - a.quantite)
    .slice(0, 5)
    .map((product) => ({
      nom: product.nom,
      quantite: Number(product.quantite.toFixed(1)),
      revenue: product.revenue,
    }))

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(price) + " FCFA"
  }

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top 5 des produits
        </CardTitle>
        <CardDescription>Produits les plus vendus par quantité</CardDescription>
      </CardHeader>
      <CardContent>
        {topProducts.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Aucune vente enregistrée
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="nom" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: "kg", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number, name: string) => {
                  if (name === "quantite") return [value + " kg", "Quantité"]
                  return [value, name]
                }}
              />
              <Bar dataKey="quantite" radius={[8, 8, 0, 0]}>
                {topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
