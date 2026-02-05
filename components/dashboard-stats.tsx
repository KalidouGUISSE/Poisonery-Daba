"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, Package, DollarSign, TrendingDown } from "lucide-react"
import { startOfDay, startOfWeek, startOfMonth, isAfter } from "date-fns"
import { useMemo } from "react"

export function DashboardStats() {
  const { sales, products } = useStore()

  const stats = useMemo(() => {
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const monthStart = startOfMonth(now)

    // Ventes du jour
    const dailySales = sales.filter((sale) => isAfter(new Date(sale.date_vente), todayStart))
    const dailyRevenue = dailySales.reduce((sum, sale) => sum + sale.prix_total, 0)
    const dailyQuantity = dailySales.reduce((sum, sale) => sum + sale.poids_kg, 0)

    // Ventes de la semaine
    const weeklySales = sales.filter((sale) => isAfter(new Date(sale.date_vente), weekStart))
    const weeklyRevenue = weeklySales.reduce((sum, sale) => sum + sale.prix_total, 0)

    // Ventes du mois
    const monthlySales = sales.filter((sale) => isAfter(new Date(sale.date_vente), monthStart))
    const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.prix_total, 0)

    // Valeur du stock
    const totalStockValue = products.reduce((sum, product) => sum + product.prix_kg * product.quantite_stock, 0)

    const formatPrice = (price: number) => new Intl.NumberFormat("fr-FR").format(price) + " $"

    return [
      {
        title: "Ventes du jour",
        value: formatPrice(dailyRevenue),
        description: `${dailyQuantity.toFixed(1)} kg vendus`,
        icon: DollarSign,
        color: "success",
        trend: "+12%",
      },
      {
        title: "Cette semaine",
        value: formatPrice(weeklyRevenue),
        description: `${weeklySales.length} transactions`,
        icon: TrendingUp,
        color: "primary",
        trend: "+8%",
      },
      {
        title: "Ce mois",
        value: formatPrice(monthlyRevenue),
        description: `${monthlySales.length} transactions`,
        icon: ShoppingCart,
        color: "info",
        trend: "+15%",
      },
      {
        title: "Valeur stock",
        value: formatPrice(totalStockValue),
        description: `${products.length} produits`,
        icon: Package,
        color: "warning",
        trend: "Stable",
      },
    ]
  }, [sales, products])

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; trend: string }> = {
      success: {
        bg: "bg-success/5 hover:bg-success/10",
        icon: "text-success",
        trend: "text-success",
      },
      primary: {
        bg: "bg-primary/5 hover:bg-primary/10",
        icon: "text-primary",
        trend: "text-primary",
      },
      info: {
        bg: "bg-info/5 hover:bg-info/10",
        icon: "text-info",
        trend: "text-info",
      },
      warning: {
        bg: "bg-warning/5 hover:bg-warning/10",
        icon: "text-warning",
        trend: "text-warning",
      },
    }
    return colors[color] || colors.primary
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color)
        return (
          <Card
            key={stat.title}
            className={`card-hover ${colors.bg} border-0 shadow-sm`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <stat.icon className={`h-4 w-4 ${colors.icon}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground truncate">
                  {stat.description}
                </p>
                <span className={`text-xs font-medium ${colors.trend} flex items-center gap-0.5`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
