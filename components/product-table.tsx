"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useStore, Product } from "@/lib/store"
import { ProductForm } from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Trash2, AlertTriangle, Edit2, Fish, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

interface PaginationInfo {
  page: number
  limit: number
  totalProducts: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function ProductTable() {
  const { deleteProduct } = useStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  // Pagination & filtering state
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalProducts: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("nom")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isDataLoading, setIsDataLoading] = useState(true)

  // Fetch products with pagination
  const fetchProducts = useCallback(async () => {
    setIsDataLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        sortBy,
        sortOrder,
        search: searchTerm
      })
      
      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      setProducts(data.products)
      setPagination(prev => ({
        ...prev,
        ...data.pagination
      }))
    } catch (error) {
      console.error("Erreur chargement produits:", error)
    } finally {
      setIsDataLoading(false)
    }
  }, [pagination.page, pagination.limit, sortBy, sortOrder, searchTerm])

  // Fetch on mount and when params change
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleDelete = (id: number) => {
    setIsLoading(true)
    deleteProduct(id)
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès",
    })
    setIsLoading(false)
    // Refresh the list
    fetchProducts()
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

  const formatPrice = (price: number) => new Intl.NumberFormat("fr-FR").format(price) + " $"

  return (
    <>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {pagination.totalProducts} produit{pagination.totalProducts !== 1 ? 's' : ''} au total
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 border-border hover:bg-transparent">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-secondary/30"
                  onClick={() => handleSort("nom")}
                >
                  <div className="flex items-center">
                    Nom {getSortIcon("nom")}
                  </div>
                </TableHead>
                <TableHead 
                  className="hidden md:table-cell cursor-pointer hover:bg-secondary/30"
                  onClick={() => handleSort("categorie")}
                >
                  <div className="flex items-center">
                    Catégorie {getSortIcon("categorie")}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right hidden sm:table-cell cursor-pointer hover:bg-secondary/30"
                  onClick={() => handleSort("prix_kg")}
                >
                  <div className="flex items-center justify-end">
                    Prix/kg {getSortIcon("prix_kg")}
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-secondary/30"
                  onClick={() => handleSort("quantite_stock")}
                >
                  <div className="flex items-center justify-end">
                    Stock {getSortIcon("quantite_stock")}
                  </div>
                </TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isDataLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <Fish className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        {searchTerm ? "Aucun produit trouvé" : "Aucun produit disponible"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="border-border hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-secondary">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.nom}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.nom}</div>
                      <div className="md:hidden text-sm text-muted-foreground">
                        {product.categorie}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="bg-secondary/50">
                        {product.categorie}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell font-medium">
                      {formatPrice(product.prix_kg)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {product.quantite_stock < 5 && (
                          <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                        )}
                        <span
                          className={`font-medium ${
                            product.quantite_stock < 5
                              ? "text-destructive"
                              : product.quantite_stock < 10
                              ? "text-warning"
                              : ""
                          }`}
                        >
                          {product.quantite_stock} kg
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <ProductForm product={product} onSuccess={fetchProducts} />
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
                                Êtes-vous sûr de vouloir supprimer "{product.nom}" ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
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
              totalItems={pagination.totalProducts}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        )}
      </div>
    </>
  )
}
