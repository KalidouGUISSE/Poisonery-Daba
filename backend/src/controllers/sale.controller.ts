// Sale controller using Prisma services
import { Request, Response } from "express"
import { SaleService } from "../services/sale.service.js"
import { asyncHandler } from "../utils/async-handler.js"

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { page = "1", limit = "10" } = req.query

  const result = await SaleService.findAll(
    parseInt(page as string),
    parseInt(limit as string)
  )
  res.json(result)
})

export const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const sale = await SaleService.findById(parseInt(id))

  if (!sale) {
    return res.status(404).json({ error: "Vente non trouvée" })
  }

  res.json(sale)
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  // Gérer à la fois une vente unique et des ventes multiples
  if (req.body.products && Array.isArray(req.body.products)) {
    // Ventes multiples
    const sales = await SaleService.createMultiple(req.body)
    res.status(201).json(sales)
  } else {
    // Vente unique
    const sale = await SaleService.create(req.body)
    res.status(201).json(sale)
  }
})

export const getRevenue = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query

  let revenue: number

  if (startDate && endDate) {
    revenue = await SaleService.getRevenueByPeriod(
      new Date(startDate as string),
      new Date(endDate as string)
    )
  } else {
    revenue = await SaleService.getTotalRevenue()
  }

  res.json({ revenue })
})

export const getSalesBySeller = asyncHandler(async (req: Request, res: Response) => {
  const { sellerId } = req.params
  const sales = await SaleService.getSalesBySeller(parseInt(sellerId))
  res.json({ sales })
})

export const getSalesByProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params
  const sales = await SaleService.getSalesByProduct(parseInt(productId))
  res.json({ sales })
})