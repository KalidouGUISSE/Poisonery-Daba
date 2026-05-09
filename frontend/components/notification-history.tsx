"use client"

import { useState } from "react"
import { useStore, Notification } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Bell, Send, Check, Users, Mail, History, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export function NotificationHistory() {
  const { notifications: notificationList, clients, products, addNotification, markNotificationRead } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    type: "manual" as "manual" | "promotion",
    titre: "",
    message: "",
    produits: [] as string[],
    destinataires_type: "all" as "all" | "cibles",
    destinataires_ids: [] as number[]
  })

  const handleOpenSendDialog = () => {
    setFormData({
      type: "manual",
      titre: "",
      message: "",
      produits: [],
      destinataires_type: "all",
      destinataires_ids: []
    })
    setSendDialogOpen(true)
  }

  const handlePreferenceChange = (product: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, produits: [...prev.produits, product] }
      } else {
        return { ...prev, produits: prev.produits.filter(p => p !== product) }
      }
    })
  }

  const handleClientSelection = (clientId: number, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, destinataires_ids: [...prev.destinataires_ids, clientId] }
      } else {
        return { ...prev, destinataires_ids: prev.destinataires_ids.filter(id => id !== clientId) }
      }
    })
  }

  const handleSubmit = async () => {
    if (!formData.titre || !formData.message) {
      toast({
        title: "Erreur",
        description: "Le titre et le message sont requis",
        variant: "destructive"
      })
      return
    }

    if (formData.destinataires_type === "cibles" && formData.destinataires_ids.length === 0) {
      toast({
        title: "Erreur",
        description: "Sélectionnez au moins un client",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      await addNotification(formData as any)
      toast({
        title: "Notification envoyée",
        description: formData.destinataires_type === "all" 
          ? `Notification envoyée à ${clients.length} clients`
          : `Notification envoyée à ${formData.destinataires_ids.length} client(s)`
      })
      setSendDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: number, lu: boolean) => {
    try {
      await markNotificationRead(id, !lu)
    } catch (error) {
      console.error("Erreur mise à jour notification:", error)
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "restock":
        return <Badge className="bg-blue-500">Réapprovisionnement</Badge>
      case "promotion":
        return <Badge className="bg-purple-500">Promotion</Badge>
      default:
        return <Badge variant="secondary">Manuelle</Badge>
    }
  }

  const getDestinatairesLabel = (notif: Notification) => {
    if (notif.destinataires_type === "all") {
      return "Tous les clients"
    }
    return `${notif.destinataires_ids.length} client(s)`
  }

  const formatTimeAgo = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
    } catch {
      return dateStr
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            {notificationList.length} notification{notificationList.length !== 1 ? 's' : ''} envoyée{notificationList.length !== 1 ? 's' : ''}s
          </span>
        </div>
        <Button onClick={handleOpenSendDialog} className="gap-2">
          <Send className="h-4 w-4" />
          Nouvelle notification
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 border-border hover:bg-transparent">
                <TableHead>Type</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead className="hidden md:table-cell">Message</TableHead>
                <TableHead className="hidden lg:table-cell">Destinataires</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notificationList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <Bell className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">Aucune notification envoyée</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                notificationList.map((notif) => (
                  <TableRow 
                    key={notif.id} 
                    className="border-border hover:bg-secondary/30 cursor-pointer"
                    onClick={() => handleMarkAsRead(notif.id, notif.lu)}
                  >
                    <TableCell>
                      {getTypeBadge(notif.type)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{notif.titre}</div>
                      {notif.produits.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {notif.produits.slice(0, 2).map((prod, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {prod}
                            </Badge>
                          ))}
                          {notif.produits.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{notif.produits.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="max-w-xs truncate text-sm text-muted-foreground">
                        {notif.message}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-sm">
                        {notif.destinataires_type === "all" ? (
                          <Users className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Mail className="h-3 w-3 text-muted-foreground" />
                        )}
                        {getDestinatairesLabel(notif)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(notif.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {notif.lu ? (
                        <Badge variant="secondary" className="gap-1">
                          <Check className="h-3 w-3" />
                          Lu
                        </Badge>
                      ) : (
                        <Badge className="bg-primary gap-1">
                          Non lu
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Send Notification Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Envoyer une notification</DialogTitle>
            <DialogDescription>
              Envoyez une notification à vos clients
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de notification</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "manual" | "promotion") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Notification manuelle</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Nouveau stock disponible!"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Votre message..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Produits concernés (optionnel)</Label>
              <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`notif-prod-${product.id}`}
                      checked={formData.produits.includes(product.nom)}
                      onCheckedChange={(checked) => handlePreferenceChange(product.nom, checked as boolean)}
                    />
                    <Label htmlFor={`notif-prod-${product.id}`} className="text-sm font-normal cursor-pointer">
                      {product.nom}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Destinataires</Label>
              <Select
                value={formData.destinataires_type}
                onValueChange={(value: "all" | "cibles") => setFormData({ ...formData, destinataires_type: value, destinataires_ids: [] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les clients ({clients.length})</SelectItem>
                  <SelectItem value="cibles">Clients ciblés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.destinataires_type === "cibles" && (
              <div className="space-y-2">
                <Label>Sélectionner les clients</Label>
                <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
                  {clients.filter(c => c.actif).map((client) => (
                    <div key={client.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`client-${client.id}`}
                        checked={formData.destinataires_ids.includes(client.id)}
                        onCheckedChange={(checked) => handleClientSelection(client.id, checked as boolean)}
                      />
                      <Label htmlFor={`client-${client.id}`} className="text-sm font-normal cursor-pointer">
                        {client.prenom} {client.nom} - {client.telephone}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSendDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
