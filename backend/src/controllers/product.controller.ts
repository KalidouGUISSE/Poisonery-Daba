// Product controller using Prisma services
import { Request, Response } from "express"
import { ProductService } from "../services/product.service.js"
import { asyncHandler } from "../utils/async-handler.js"

export const list = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "nom",
    sortOrder = "asc",
    search,
    categorie,
  } = req.query

  const filters = {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
    search: search as string,
    categorie: categorie as string,
  }

  const result = await ProductService.findAll(filters)
  res.json(result)
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.create(req.body)
  res.status(201).json(product)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await ProductService.update(parseInt(id), req.body)
  res.json(product)
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await ProductService.delete(parseInt(id))
  res.json(product)
})

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await ProductService.getCategories()
  res.json({ categories })
})