"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { SaleForm } from "@/components/sale-form"
import { SalesHistory } from "@/components/sales-history"

export default function VentesPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "vendeur"]}>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Gestion des ventes</h1>
              <p className="text-muted-foreground">Enregistrez les ventes et consultez l'historique</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-1">
                <SaleForm />
              </div>
              <div className="lg:col-span-2">
                <SalesHistory />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
