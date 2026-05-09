"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
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
      formattedDate: format(date, "EEEE dd MMMM", { locale: fr }),
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(price)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm text-muted-foreground mb-1">{data.formattedDate}</p>
          <p className="text-xl font-bold text-primary">{formatPrice(data.revenue)} $</p>
        </div>
      )
    }
    return null
  }

  // Calculer le total et la moyenne
  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0)
  const avgRevenue = chartData.length > 0 ? totalRevenue / chartData.length : 0

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <span>Revenus (7 jours)</span>
        </CardTitle>
        <CardDescription>Évolution du chiffre d'affaires</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats summary */}
        <div className="flex items-center gap-6 mb-4 px-2">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold gradient-text">{formatPrice(totalRevenue)} $</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Moyenne/jour</p>
            <p className="text-lg font-semibold text-foreground">{formatPrice(avgRevenue)} $</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={formatPrice}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0891b2"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              activeDot={{ r: 6, fill: '#0891b2', stroke: '#fff', strokeWidth: 2 }}
              dot={{ r: 4, fill: '#0891b2', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
