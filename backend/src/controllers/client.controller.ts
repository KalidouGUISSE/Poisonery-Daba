// Client controller using Prisma services
import { Request, Response } from "express"
import { ClientService } from "../services/client.service.js"
import { asyncHandler } from "../utils/async-handler.js"

export const list = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "10",
    sortBy = "nom",
    sortOrder = "asc",
    search,
    actif,
  } = req.query

  const filters = {
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
    search: search as string,
    actif: actif === "true" ? true : actif === "false" ? false : undefined,
  }

  const result = await ClientService.findAll(filters)
  res.json(result)
})

export const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const client = await ClientService.findById(parseInt(id))

  if (!client) {
    return res.status(404).json({ error: "Client non trouvé" })
  }

  res.json(client)
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  const client = await ClientService.create(req.body)
  res.status(201).json(client)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const client = await ClientService.update(parseInt(id), req.body)
  res.json(client)
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const client = await ClientService.delete(parseInt(id))
  res.json(client)
})