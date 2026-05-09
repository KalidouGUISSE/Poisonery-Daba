"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Edit, Trash2, UserPlus, Users, Activity } from "lucide-react"
import { useAuth } from "@/lib/auth"

// Mock data for vendeurs
const mockVendeurs = [
  {
    id: 1,
    nom: "Vendeur 1",
    username: "vendeur1",
    email: "vendeur1@poissonnerie.com",
    telephone: "+221 77 123 45 67",
    role: "vendeur",
    statut: "actif",
    dateCreation: "2024-01-15",
    ventesTotal: 125000,
    nombreVentes: 45
  },
  {
    id: 2,
    nom: "Vendeur 2",
    username: "vendeur2",
    email: "vendeur2@poissonnerie.com",
    telephone: "+221 77 987 65 43",
    role: "vendeur",
    statut: "actif",
    dateCreation: "2024-02-20",
    ventesTotal: 98000,
    nombreVentes: 32
  },
  {
    id: 3,
    nom: "Vendeur 3",
    username: "vendeur3",
    email: "vendeur3@poissonnerie.com",
    telephone: "+221 76 555 44 33",
    role: "vendeur",
    statut: "inactif",
    dateCreation: "2024-03-10",
    ventesTotal: 67000,
    nombreVentes: 28
  }
]

export default function VendeursPage() {
  const { user } = useAuth()
  const [vendeurs, setVendeurs] = useState(mockVendeurs)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedVendeur, setSelectedVendeur] = useState<typeof mockVendeurs[0] | null>(null)

  const filteredVendeurs = vendeurs.filter(vendeur =>
    vendeur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendeur.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendeur.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  const handleAddVendeur = (vendeurData: any) => {
    const newVendeur = {
      id: vendeurs.length + 1,
      ...vendeurData,
      statut: "actif",
      dateCreation: new Date().toISOString().split('T')[0],
      ventesTotal: 0,
      nombreVentes: 0
    }
    setVendeurs([...vendeurs, newVendeur])
    setIsAddDialogOpen(false)
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-background/95">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">Gestion des Vendeurs</h1>
                <p className="text-muted-foreground text-lg">
                  Gérez vos vendeurs et suivez leurs performances
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Nouveau Vendeur
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Ajouter un Nouveau Vendeur
                    </DialogTitle>
                    <DialogDescription>
                      Créez un nouveau compte vendeur avec les informations nécessaires.
                    </DialogDescription>
                  </DialogHeader>
                  <AddVendeurForm onSubmit={handleAddVendeur} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vendeurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vendeurs.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {vendeurs.filter(v => v.statut === 'actif').length} actifs
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPrice(vendeurs.reduce((sum, v) => sum + v.ventesTotal, 0))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Par tous les vendeurs
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Moyenne/Vendeur</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPrice(Math.round(vendeurs.reduce((sum, v) => sum + v.ventesTotal, 0) / vendeurs.length))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ventes par vendeur
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Liste des Vendeurs</CardTitle>
                    <CardDescription>
                      Gérez et surveillez l'activité de vos vendeurs
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un vendeur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-[300px]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendeur</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Date création</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendeurs.map((vendeur) => (
                      <TableRow key={vendeur.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={`/placeholder-user.jpg`} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                                {vendeur.nom.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{vendeur.nom}</div>
                              <div className="text-sm text-muted-foreground">@{vendeur.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{vendeur.email}</div>
                            <div className="text-muted-foreground">{vendeur.telephone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={vendeur.statut === 'actif' ? 'default' : 'secondary'}>
                            {vendeur.statut}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{formatPrice(vendeur.ventesTotal)}</div>
                            <div className="text-muted-foreground">{vendeur.nombreVentes} ventes</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {vendeur.dateCreation}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedVendeur(vendeur)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

function AddVendeurForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    nom: "",
    username: "",
    email: "",
    telephone: "",
    role: "vendeur"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ nom: "", username: "", email: "", telephone: "", role: "vendeur" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom complet</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vendeur">Vendeur</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline">
          Annuler
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
          Créer le Vendeur
        </Button>
      </div>
    </form>
  )
}