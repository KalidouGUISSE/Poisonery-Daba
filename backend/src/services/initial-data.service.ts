// Initial data service using Prisma
import { UserService } from "./user.service.js"
import { ProductService } from "./product.service.js"
import { ClientService } from "./client.service.js"
import { SaleService } from "./sale.service.js"
import { NotificationService } from "./notification.service.js"

export class InitialDataService {
  static async getAllData() {
    const [users, productsResult, clientsResult, salesResult, notificationsResult] = await Promise.all([
      UserService.findAll(),
      ProductService.findAll({ limit: 1000 }),
      ClientService.findAll({ limit: 1000 }),
      SaleService.findAll(1, 1000),
      NotificationService.findAll(1, 1000),
    ])

    // Formater les utilisateurs (sans mot de passe)
    const formattedUsers = users.map(user => UserService.formatUser(user))

    return {
      users: formattedUsers,
      products: productsResult.products,
      clients: clientsResult.clients,
      sales: salesResult.sales,
      notifications: notificationsResult.notifications,
    }
  }

  static async getDashboardStats() {
    const [
      totalRevenue,
      totalProducts,
      totalClients,
      totalSales,
      recentSales,
      lowStockProducts,
    ] = await Promise.all([
      SaleService.getTotalRevenue(),
      ProductService.findAll({ limit: 1000 }).then(r => r.products.length),
      ClientService.findAll({ limit: 1000 }).then(r => r.clients.length),
      SaleService.findAll(1, 1000).then(r => r.sales.length),
      SaleService.findAll(1, 5).then(r => r.sales), // 5 ventes récentes
      this.getLowStockProducts(),
    ])

    return {
      totalRevenue,
      totalProducts,
      totalClients,
      totalSales,
      recentSales,
      lowStockProducts,
    }
  }

  private static async getLowStockProducts() {
    const result = await ProductService.findAll({ limit: 1000 })
    return result.products
      .filter(product => product.quantite_stock < 5) // Seuil de stock faible
      .slice(0, 5) // Limiter à 5 produits
  }
}