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
    return new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(price) + " $"
  }

  // Couleurs claires et vibrantes pour les produits de la mer
  const COLORS = [
    "#0891b2", // Cyan - Thiof
    "#0d9488", // Teal - Dorade
    "#0284c7", // Sky blue - Crevettes
    "#0369a1", // Ocean blue - Saumon
    "#075985", // Deep blue - Bar
  ]

  // Couleurs plus claires pour les barres
  const LIGHT_COLORS = [
    "#22d3ee", // Cyan light
    "#2dd4bf", // Teal light
    "#38bdf8", // Sky light
    "#7dd3fc", // Blue light
    "#38bdf8", // Ocean light
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-foreground">{data.nom}</p>
          <p className="text-sm text-primary font-medium">{data.quantite} kg vendus</p>
          <p className="text-xs text-muted-foreground mt-1">
            Revenu: {formatPrice(data.revenue)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <span>Top 5 des produits</span>
        </CardTitle>
        <CardDescription>Produits les plus vendus par quantité (kg)</CardDescription>
      </CardHeader>
      <CardContent>
        {topProducts.length === 0 ? (
          <div className="flex items-center justify-center h-[280px] text-muted-foreground">
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Aucune vente enregistrée</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="nom"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
              />
              <Bar
                dataKey="quantite"
                radius={[0, 8, 8, 0]}
                barSize={32}
              >
                {topProducts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Légende des couleurs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
          {topProducts.map((product, index) => (
            <div
              key={product.nom}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-xs"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium">{product.nom}</span>
              <span className="text-muted-foreground">{product.quantite}kg</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
