"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { SaleForm } from "@/components/sale-form"
import { SalesHistory } from "@/components/sales-history"
import { ShoppingCart } from "lucide-react"

export default function VentesPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "vendeur"]}>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 bg-background">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Ventes
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Enregistrez les ventes et consultez l'historique
              </p>
            </div>
          </header>

          {/* Contenu */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1">
                <SaleForm />
              </div>
              <div className="xl:col-span-2">
                <SalesHistory />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
