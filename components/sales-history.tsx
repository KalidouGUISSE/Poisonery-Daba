"use client"
import { useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Search, Filter, Calendar, Clock, User, Package, DollarSign, Download } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useStore, useInitializeStore } from "@/lib/store"

export function SalesHistory() {
  const { products, users, sales } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeller, setSelectedSeller] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<string>("all")

  // Initialiser les données du store
  useInitializeStore()

  const getFilteredSales = useCallback(() => {
    if (!products.length || !users.length || !sales.length) return []

    let filtered = sales.map((sale: any) => ({
      id: sale.id,
      sellerId: sale.vendeur_id,
      productId: sale.produit_id,
      quantity: sale.poids_kg,
      unitPrice: products.find((p) => p.id === sale.produit_id)?.prix_kg || 0,
      totalAmount: sale.prix_total,
      saleDate: sale.date_vente,
      customerName: 'Client anonyme',
      paymentMethod: 'Espèces'
    }))

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(sale =>
        products.find(p => p.id === sale.productId)?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        users.find(s => s.id === sale.sellerId)?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrer par vendeur
    if (selectedSeller !== "all") {
      filtered = filtered.filter(sale => sale.sellerId.toString() === selectedSeller)
    }

    // Filtrer par produit
    if (selectedProduct !== "all") {
      filtered = filtered.filter(sale => sale.productId.toString() === selectedProduct)
    }

    // Trier par date (plus récent en premier)
    return filtered.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
  }, [products, users, sales, searchTerm, selectedSeller, selectedProduct])

  const filteredSales = getFilteredSales()

  const formatPrice = (price: number) => new Intl.NumberFormat("fr-FR").format(price) + " $"

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return {
        date: format(date, "dd MMM yyyy", { locale: fr }),
        time: format(date, "HH:mm", { locale: fr })
      }
    } catch {
      return { date: dateString, time: "" }
    }
  }

  const getProductName = (productId: number) => products.find(p => p.id === productId)?.nom || "Produit inconnu"

  const getSellerName = (sellerId: number) => users.find(s => s.id === sellerId)?.nom || "Vendeur inconnu"

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)

  if (!products.length) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">Chargement des données...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historique des ventes
            </CardTitle>
            <CardDescription>Détail complet de toutes les transactions</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1 self-start sm:self-auto">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-focus"
            />
          </div>

          <Select value={selectedSeller} onValueChange={setSelectedSeller}>
            <SelectTrigger className="w-full sm:w-48">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Vendeur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-full sm:w-48">
              <Package className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Produit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 border-border hover:bg-transparent">
                  <TableHead className="w-[100px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">Date</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">Heure</span>
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">Produit</span>
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[100px]">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">Vendeur</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right w-[80px]">Qty</TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">Total</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                          <History className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">
                          {searchTerm || selectedSeller !== "all" || selectedProduct !== "all"
                            ? "Aucune vente trouvée"
                            : "Aucune vente enregistrée"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale) => {
                    const { date, time } = formatDate(sale.saleDate)
                    return (
                      <TableRow key={sale.id} className="border-border hover:bg-secondary/30 transition-colors">
                        <TableCell className="font-medium text-sm">{date}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{time}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {getProductName(sale.productId)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
                            {getSellerName(sale.sellerId)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm">
                          {sale.quantity} kg
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {formatPrice(sale.totalAmount)}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Résumé */}
        {filteredSales.length > 0 && (
          <div className="mt-4 p-4 bg-secondary/50 rounded-xl border border-border/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">{filteredSales.length}</div>
                <div className="text-muted-foreground">Ventes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{formatPrice(totalRevenue)}</div>
                <div className="text-muted-foreground">CA total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalQuantity.toFixed(1)} kg</div>
                <div className="text-muted-foreground">Quantité</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {new Set(filteredSales.map(sale => sale.sellerId)).size}
                </div>
                <div className="text-muted-foreground">Vendeurs</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
