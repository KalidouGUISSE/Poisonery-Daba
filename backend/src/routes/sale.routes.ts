import { Router } from "express"
import * as controller from "../controllers/sale.controller.ts"
import { requireRoles } from "../middlewares/auth.middleware.ts"
import { asyncHandler } from "../utils/async-handler.ts"

export const saleRouter = Router()

saleRouter.get("/", requireRoles(["admin", "vendeur"]), asyncHandler(controller.list))
saleRouter.get("/:id", requireRoles(["admin", "vendeur"]), asyncHandler(controller.findOne))
saleRouter.post("/", requireRoles(["admin", "vendeur"]), asyncHandler(controller.create))
saleRouter.get("/revenue", requireRoles(["admin", "vendeur"]), asyncHandler(controller.getRevenue))
saleRouter.get("/seller/:sellerId", requireRoles(["admin", "vendeur"]), asyncHandler(controller.getSalesBySeller))
saleRouter.get("/product/:productId", requireRoles(["admin", "vendeur"]), asyncHandler(controller.getSalesByProduct))
