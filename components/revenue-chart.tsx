"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import { format, subDays, startOfDay } from "date-fns"
import { fr } from "date-fns/locale"

export function RevenueChart() {
  const { sales } = useStore()

  // Get last 7 days of data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return startOfDay(date)
  })

  const chartData = last7Days.map((date) => {
    const dayStart = startOfDay(date)
    const dayEnd = startOfDay(subDays(date, -1))

    const daySales = sales.filter((sale) => {
      const saleDate = new Date(sale.date_vente)
      return saleDate >= dayStart && saleDate < dayEnd
    })

    const revenue = daySales.reduce((sum, sale) => sum + sale.prix_total, 0)

    return {
      date: format(date, "EEE dd", { locale: fr }),
      revenue: revenue,
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(price)
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Évolution du chiffre d'affaires
        </CardTitle>
        <CardDescription>Revenus des 7 derniers jours</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={formatPrice}
              label={{ value: "FCFA", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [formatPrice(value) + " FCFA", "Revenus"]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
