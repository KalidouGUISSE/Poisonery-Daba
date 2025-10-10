"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { TopProductsChart } from "@/components/top-products-chart"
import { RevenueChart } from "@/components/revenue-chart"
import { RecentSales } from "@/components/recent-sales"
import { StockAlerts } from "@/components/stock-alerts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-background/95">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Vue d'ensemble de votre activité poissonnière
              </p>
            </div>

            <DashboardStats />

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="card-hover bg-gradient-to-br from-card to-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Revenus Mensuels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RevenueChart />
                </CardContent>
              </Card>
              <Card className="card-hover bg-gradient-to-br from-card to-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Top Produits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TopProductsChart />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="card-hover bg-gradient-to-br from-card to-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Ventes Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              <Card className="card-hover bg-gradient-to-br from-card to-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Alertes Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StockAlerts />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
