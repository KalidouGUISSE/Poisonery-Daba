"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Fish,
  ShoppingCart,
  Package,
  User,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Users,
  Bell,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "vendeur"] },
  { name: "Produits", href: "/produits", icon: Fish, roles: ["admin"] },
  { name: "Ventes", href: "/ventes", icon: ShoppingCart, roles: ["admin", "vendeur"] },
  { name: "Stock", href: "/stock", icon: Package, roles: ["admin", "vendeur"] },
  { name: "Vendeurs", href: "/vendeurs", icon: User, roles: ["admin"] },
  { name: "Clients", href: "/clients", icon: Users, roles: ["admin"] },
]

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const filteredNavigation = navigation.filter((item) => user && item.roles.includes(user.role))

  const NavContent = () => (
    <>
      {/* Logo et titre */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-border/50">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
            <Fish className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
        </div>
        <div className="hidden sm:block">
          <span className="text-lg font-bold gradient-text">PoissyShop</span>
          <p className="text-xs text-muted-foreground -mt-1">Gestion Poissonnerie</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  isActive ? "bg-primary/10" : "group-hover:bg-accent/10"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              </div>
              <span className={cn("hidden sm:block", isActive && "font-semibold")}>{item.name}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full hidden sm:block" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Section utilisateur */}
      <div className="p-3 border-t border-border/50 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-secondary/50">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-secondary" />
          </div>
          <div className="flex-1 min-w-0 hidden sm:block">
            <p className="text-sm font-medium truncate">{user?.nom}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Bouton mobile - visible uniquement sur mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" className="shadow-md bg-background">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </SheetTrigger>

        {/* Sheet mobile */}
        <SheetContent side="left" className="w-72 p-0 bg-background flex flex-col">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Sidebar desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen sticky top-0 bg-background border-r border-border shadow-sm",
          className
        )}
      >
        <NavContent />
      </aside>
    </>
  )
}
