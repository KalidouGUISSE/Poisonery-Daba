"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { StockTable } from "@/components/stock-table"
import { StockAlerts } from "@/components/stock-alerts"

export default function StockPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "vendeur"]}>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Gestion du stock</h1>
              <p className="text-muted-foreground">Consultez et gérez les niveaux de stock</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <StockTable />
              </div>
              <div className="lg:col-span-1">
                <StockAlerts />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
