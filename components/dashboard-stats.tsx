"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, Package, DollarSign } from "lucide-react"
import { startOfDay, startOfWeek, startOfMonth, isAfter } from "date-fns"

export function DashboardStats() {
  const { sales, products } = useStore()

  const now = new Date()
  const todayStart = startOfDay(now)
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const monthStart = startOfMonth(now)

  // Calculate daily revenue
  const dailySales = sales.filter((sale) => isAfter(new Date(sale.date_vente), todayStart))
  const dailyRevenue = dailySales.reduce((sum, sale) => sum + sale.prix_total, 0)
  const dailyQuantity = dailySales.reduce((sum, sale) => sum + sale.poids_kg, 0)

  // Calculate weekly revenue
  const weeklySales = sales.filter((sale) => isAfter(new Date(sale.date_vente), weekStart))
  const weeklyRevenue = weeklySales.reduce((sum, sale) => sum + sale.prix_total, 0)

  // Calculate monthly revenue
  const monthlySales = sales.filter((sale) => isAfter(new Date(sale.date_vente), monthStart))
  const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.prix_total, 0)

  // Calculate total stock value
  const totalStockValue = products.reduce((sum, product) => sum + product.prix_kg * product.quantite_stock, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  const stats = [
    {
      title: "Ventes du jour",
      value: formatPrice(dailyRevenue),
      description: `${dailyQuantity.toFixed(1)} kg vendus`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Ventes de la semaine",
      value: formatPrice(weeklyRevenue),
      description: `${weeklySales.length} transactions`,
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Ventes du mois",
      value: formatPrice(monthlyRevenue),
      description: `${monthlySales.length} transactions`,
      icon: ShoppingCart,
      color: "text-purple-500",
    },
    {
      title: "Valeur du stock",
      value: formatPrice(totalStockValue),
      description: `${products.length} produits`,
      icon: Package,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="border-border/50 bg-gradient-to-br from-card to-card/50 card-hover group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color.replace('text-', 'from-').replace('-500', '-500/10')} to-current/5`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1 gradient-text">{stat.value}</div>
            <p className="text-sm text-muted-foreground font-medium">{stat.description}</p>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
