"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { StockTable } from "@/components/stock-table"
import { StockAlerts } from "@/components/stock-alerts"
import { Package } from "lucide-react"

export default function StockPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "vendeur"]}>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 bg-background">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
                <Package className="h-6 w-6" />
                Stock
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Consultez et gérez les niveaux de stock en temps réel
              </p>
            </div>
          </header>

          {/* Contenu */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <StockTable />
              </div>
              <div className="xl:col-span-1">
                <StockAlerts />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
