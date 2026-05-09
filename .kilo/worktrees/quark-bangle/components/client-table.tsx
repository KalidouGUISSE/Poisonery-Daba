"use client"

import { useState, useEffect, useCallback } from "react"
import { useStore, Client } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Pagination } from "@/components/ui/pagination"
import { UserPlus, Trash2, Edit2, Users, Phone, Mail, MapPin, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

const PRODUCT_OPTIONS = ["Thiof", "Dorade", "Saumon", "Crevettes", "Bar", "Thon", "Cabillaud", "Langoustines"]

interface PaginationInfo {
  page: number
  limit: number
  totalClients: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function ClientTable() {
  const { addClient, updateClient, deleteClient } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    adresse: "",
    preferences: [] as string[],
    actif: true
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Pagination & filtering state
  const [clients, setClients] = useState<Client[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalClients: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("nom")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isDataLoading, setIsDataLoading] = useState(true)

  // Fetch clients with pagination
  const fetchClients = useCallback(async () => {
    setIsDataLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        sortBy,
        sortOrder,
        search: searchTerm
      })
      
      const response = await fetch(`/api/clients?${params}`)
      const data = await response.json()
      
      setClients(data.clients)
      setPagination(prev => ({
        ...prev,
        ...data.pagination
      }))
    } catch (error) {
      console.error("Erreur chargement clients:", error)
    } finally {
      setIsDataLoading(false)
    }
  }, [pagination.page, pagination.limit, sortBy, sortOrder, searchTerm])

  // Fetch on mount and when params change
  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleOpenAddDialog = () => {
    setFormData({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      adresse: "",
      preferences: [],
      actif: true
    })
    setEditingId(null)
    setAddDialogOpen(true)
  }

  const handleOpenEditDialog = (client: Client) => {
    setFormData({
      nom: client.nom,
      prenom: client.prenom,
      telephone: client.telephone,
      email: client.email,
      adresse: client.adresse,
      preferences: client.preferences,
      actif: client.actif
    })
    setEditingId(client.id)
    setEditDialogOpen(true)
  }

  const handlePreferenceChange = (product: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, preferences: [...prev.preferences, product] }
      } else {
        return { ...prev, preferences: prev.preferences.filter(p => p !== product) }
      }
    })
  }

  const handleSubmit = async () => {
    if (!formData.nom || !formData.prenom || !formData.telephone) {
      toast({
        title: "Erreur",
        description: "Le nom, prénom et téléphone sont requis",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      if (editingId) {
        await updateClient(editingId, formData)
        toast({
          title: "Client modifié",
          description: "Les informations du client ont été mises à jour"
        })
        setEditDialogOpen(false)
      } else {
        await addClient(formData)
        toast({
          title: "Client ajouté",
          description: "Le nouveau client a été ajouté avec succès"
        })
        setAddDialogOpen(false)
      }
      fetchClients()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    try {
      await deleteClient(id)
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé"
      })
      fetchClients()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleItemsPerPageChange = (limit: number) => {
    setPagination(prev => ({ ...prev, page: 1, limit }))
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="h-4 w-4 ml-1" />
    return sortOrder === "asc" 
      ? <ArrowUp className="h-4 w-4 ml-1" /> 
      : <ArrowDown className="h-4 w-4 ml-1" />
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  return (
    <>
      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        <Button onClick={handleOpenAddDialog} className="gap-2 w-full sm:w-auto">
          <UserPlus className="h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 border-border hover:bg-transparent">
                <TableHead 
                  className="cursor-pointer hover:bg-secondary/30"
                  onClick={() => handleSort("nom")}
                >
                  <div className="flex items-center">
                    Nom {getSortIcon("nom")}
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Préférences</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-secondary/30"
                  onClick={() => handleSort("actif")}
                >
                  <div className="flex items-center">
                    Statut {getSortIcon("actif")}
                  </div>
                </TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isDataLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        {searchTerm ? "Aucun client trouvé" : "Aucun client enregistré"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} className="border-border hover:bg-secondary/30">
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.prenom} {client.nom}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                          {client.telephone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {client.telephone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {client.preferences.length > 0 ? (
                          client.preferences.slice(0, 3).map((pref, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {pref}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                        {client.preferences.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{client.preferences.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.actif ? "default" : "secondary"}>
                        {client.actif ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEditDialog(client)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer "{client.prenom} {client.nom}" ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(client.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <div className="px-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalClients}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau client</DialogTitle>
            <DialogDescription>
              Ajoutez les informations du nouveau client
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            formData={formData}
            setFormData={setFormData}
            onPreferenceChange={handlePreferenceChange}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            submitLabel="Ajouter le client"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations du client
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            formData={formData}
            setFormData={setFormData}
            onPreferenceChange={handlePreferenceChange}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            submitLabel="Enregistrer les modifications"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

// Client form component
function ClientForm({
  formData,
  setFormData,
  onPreferenceChange,
  isLoading,
  onSubmit,
  submitLabel
}: {
  formData: any
  setFormData: any
  onPreferenceChange: (product: string, checked: boolean) => void
  isLoading: boolean
  onSubmit: () => void
  submitLabel: string
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            placeholder="Jean"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nom">Nom *</Label>
          <Input
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            placeholder="Dupont"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telephone">Téléphone *</Label>
        <Input
          id="telephone"
          value={formData.telephone}
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          placeholder="771234567"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="jean.dupont@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="adresse">Adresse</Label>
        <Input
          id="adresse"
          value={formData.adresse}
          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
          placeholder="12 Rue de la Paix, Dakar"
        />
      </div>

      <div className="space-y-2">
        <Label>Préférences de produits</Label>
        <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
          {PRODUCT_OPTIONS.map((product) => (
            <div key={product} className="flex items-center gap-2">
              <Checkbox
                id={`pref-${product}`}
                checked={formData.preferences.includes(product)}
                onCheckedChange={(checked) => onPreferenceChange(product, checked as boolean)}
              />
              <Label htmlFor={`pref-${product}`} className="text-sm font-normal cursor-pointer">
                {product}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="actif"
          checked={formData.actif}
          onCheckedChange={(checked) => setFormData({ ...formData, actif: checked as boolean })}
        />
        <Label htmlFor="actif" className="text-sm font-normal">
          Client actif
        </Label>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => {}}>
          Annuler
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Chargement..." : submitLabel}
        </Button>
      </DialogFooter>
    </div>
  )
}
