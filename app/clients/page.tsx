"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { ClientTable } from "@/components/client-table"
import { NotificationHistory } from "@/components/notification-history"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Bell } from "lucide-react"

export default function ClientsPage() {
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
                  <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Clients & Notifications</h1>
                  <p className="text-muted-foreground text-sm sm:text-base mt-1">
                    Gérez vos clients et envoyez des notifications
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Contenu */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Tabs defaultValue="clients" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="clients" className="gap-2">
                  <Users className="h-4 w-4" />
                  Clients
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Liste des clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ClientTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NotificationHistory />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
