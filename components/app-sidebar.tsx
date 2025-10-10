"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Fish, ShoppingCart, Package, User, LogOut } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "vendeur"] },
  { name: "Produits", href: "/produits", icon: Fish, roles: ["admin"] },
  { name: "Ventes", href: "/ventes", icon: ShoppingCart, roles: ["admin", "vendeur"] },
  { name: "Stock", href: "/stock", icon: Package, roles: ["admin", "vendeur"] },
  { name: "Vendeurs", href: "/vendeurs", icon: User, roles: ["admin"] },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredNavigation = navigation.filter((item) => user && item.roles.includes(user.role))

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-card to-card/95 border-r border-border shadow-lg">
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="relative">
          <Fish className="h-7 w-7 text-primary" />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse"></div>
        </div>
        <div>
          <span className="text-lg font-bold gradient-text">Poissonnerie</span>
          <p className="text-xs text-muted-foreground">Gestion Pro</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 shadow-sm"
                  : "text-muted-foreground hover:bg-gradient-to-r hover:from-secondary/50 hover:to-secondary/30 hover:text-foreground hover:scale-[1.02]",
              )}
            >
              <div className={cn(
                "relative z-10 flex items-center gap-3",
                isActive && "text-primary"
              )}>
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isActive ? "bg-primary/10" : "group-hover:bg-accent/10"
                )}>
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-primary" : "group-hover:text-accent-foreground"
                  )} />
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl"></div>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/50 p-4 space-y-3 bg-gradient-to-t from-secondary/5 to-transparent">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">{user?.nom}</p>
            <p className="text-xs text-muted-foreground capitalize font-medium">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-xl"
          onClick={logout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
