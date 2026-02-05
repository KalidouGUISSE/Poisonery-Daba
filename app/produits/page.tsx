"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { ProductForm } from "@/components/product-form"
import { ProductTable } from "@/components/product-table"
import { Button } from "@/components/ui/button"
import { Plus, Fish } from "lucide-react"

export default function ProduitsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 bg-background">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
                    <Fish className="h-6 w-6" />
                    Produits
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Gérez votre catalogue de poissons et fruits de mer
                  </p>
                </div>
                <ProductForm />
              </div>
            </div>
          </header>

          {/* Contenu */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ProductTable />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
