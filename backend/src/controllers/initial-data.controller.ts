// Initial data controller using Prisma services
import { Request, Response } from "express"
import { InitialDataService } from "../services/initial-data.service.js"
import { asyncHandler } from "../utils/async-handler.js"

export const getInitialData = asyncHandler(async (req: Request, res: Response) => {
  const data = await InitialDataService.getAllData()

  res.json({
    products: data.products,
    users: data.users,
    sales: data.sales,
    clients: data.clients,
    notifications: data.notifications,
  })
})

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await InitialDataService.getDashboardStats()

  res.json(stats)
})