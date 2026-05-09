"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { TopProductsChart } from "@/components/top-products-chart"
import { RevenueChart } from "@/components/revenue-chart"
import { RecentSales } from "@/components/recent-sales"
import { StockAlerts } from "@/components/stock-alerts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 bg-background">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Dashboard</h1>
                  <p className="text-muted-foreground text-sm sm:text-base mt-1">
                    Vue d'ensemble de votre activité poissonnière
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Mis à jour en temps réel</span>
                </div>
              </div>
            </div>
          </header>

          {/* Contenu */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Statistiques principales */}
            <DashboardStats />

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Revenus Mensuels
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <RevenueChart />
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    Top Produits
                  </CardTitle>
                  <Package className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <TopProductsChart />
                </CardContent>
              </Card>
            </div>

            {/* Section inférieure */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    Ventes Récentes
                  </CardTitle>
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    Alertes Stock
                  </CardTitle>
                  <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning">
                    Attention requise
                  </span>
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
