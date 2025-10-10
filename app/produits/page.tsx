"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { ProductForm } from "@/components/product-form"
import { ProductTable } from "@/components/product-table"

export default function ProduitsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Gestion des produits</h1>
                <p className="text-muted-foreground">Gérez votre catalogue de poissons et fruits de mer</p>
              </div>
              <ProductForm />
            </div>

            <ProductTable />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
