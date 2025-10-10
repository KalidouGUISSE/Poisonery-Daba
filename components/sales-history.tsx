"use client"
import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Search, Filter, Calendar, Clock, User, Package, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useStore, useInitializeStore } from "@/lib/store"

interface Sale {
  id: number
  sellerId: number
  productId: number
  quantity: number
  unitPrice: number
  totalAmount: number
  saleDate: string
  customerName: string
  paymentMethod: string
}

interface Product {
  id: number
  name: string
  category: string
  price: number
  unit: string
  description: string
  image: string
  inStock: boolean
  stockQuantity: number
  supplier: string
}

interface Seller {
  id: number
  name: string
  phone: string
  email: string
  address: string
  joinDate: string
  active: boolean
  totalSales: number
}

interface SalesData {
  sales: Sale[]
  products: Product[]
  sellers: Seller[]
}

export function SalesHistory() {
  const { products, users, sales } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeller, setSelectedSeller] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<string>("all")

  // Initialiser les données du store
  useInitializeStore()

  // Fonction pour obtenir les ventes filtrées
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

  // Données adaptées pour l'affichage
  const data: SalesData = {
    sales: filteredSales,
    products: products.map((product) => ({
      id: product.id,
      name: product.nom,
      category: product.categorie,
      price: product.prix_kg,
      unit: 'kg',
      description: `${product.nom} - ${product.categorie}`,
      image: product.image,
      inStock: product.quantite_stock > 0,
      stockQuantity: product.quantite_stock,
      supplier: 'Fournisseur local'
    })),
    sellers: users.map((user) => ({
      id: user.id,
      name: user.nom || user.username,
      phone: '',
      email: '',
      address: '',
      joinDate: new Date().toISOString(),
      active: true,
      totalSales: sales.filter((s: any) => s.vendeur_id === user.id).length
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

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

  const getProductName = (productId: number) => {
    return data?.products.find(p => p.id === productId)?.name || "Produit inconnu"
  }

  const getSellerName = (sellerId: number) => {
    return data?.sellers.find(s => s.id === sellerId)?.name || "Vendeur inconnu"
  }

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      "Espèces": "default",
      "Carte": "secondary",
      "Chèque": "outline"
    } as const

    return variants[method as keyof typeof variants] || "default"
  }

  if (!data) {
    return (
      <Card className="border-border">
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Chargement des données...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historique des ventes
        </CardTitle>
        <CardDescription>Détail complet de toutes les ventes avec vendeur, produit, date et heure</CardDescription>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par produit, vendeur ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedSeller} onValueChange={setSelectedSeller}>
            <SelectTrigger className="w-full sm:w-48">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tous les vendeurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les vendeurs</SelectItem>
              {data.sellers.map(seller => (
                <SelectItem key={seller.id} value={seller.id.toString()}>
                  {seller.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-full sm:w-48">
              <Package className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tous les produits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les produits</SelectItem>
              {data.products.map(product => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent bg-muted/50">
                <TableHead className="w-[100px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Date</span>
                  </div>
                </TableHead>
                <TableHead className="w-[80px]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Heure</span>
                  </div>
                </TableHead>
                <TableHead className="min-w-[150px]">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Produit</span>
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Vendeur</span>
                  </div>
                </TableHead>
                <TableHead className="text-right w-[100px]">
                  <span className="font-semibold">Quantité</span>
                </TableHead>
                <TableHead className="text-right min-w-[120px]">
                  <div className="flex items-center gap-1 justify-end">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Prix total</span>
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <span className="font-semibold">Client</span>
                </TableHead>
                <TableHead className="w-[100px]">
                  <span className="font-semibold">Paiement</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <History className="h-8 w-8 text-muted-foreground/50" />
                      <span className="text-muted-foreground font-medium">
                        {searchTerm || selectedSeller !== "all" || selectedProduct !== "all"
                          ? "Aucune vente trouvée avec ces critères"
                          : "Aucune vente enregistrée"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => {
                  const { date, time } = formatDate(sale.saleDate)
                  return (
                    <TableRow key={sale.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-medium text-sm">{date}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{time}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-medium">
                          {getProductName(sale.productId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                          {getSellerName(sale.sellerId)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-sm">
                        <span className="inline-flex items-center gap-1">
                          {sale.quantity}
                          <span className="text-muted-foreground text-xs">
                            {data.products.find(p => p.id === sale.productId)?.unit || 'kg'}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {formatPrice(sale.totalAmount)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {sale.customerName}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentMethodBadge(sale.paymentMethod)} className="font-medium">
                          {sale.paymentMethod}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Résumé */}
        {filteredSales.length > 0 && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-lg">{filteredSales.length}</div>
                <div className="text-muted-foreground">Ventes totales</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">
                  {formatPrice(filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0))}
                </div>
                <div className="text-muted-foreground">Montant total</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">
                  {filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)}
                </div>
                <div className="text-muted-foreground">Quantité totale</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">
                  {new Set(filteredSales.map(sale => sale.sellerId)).size}
                </div>
                <div className="text-muted-foreground">Vendeurs actifs</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
