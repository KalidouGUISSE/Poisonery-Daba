import { Router } from "express"
import * as controller from "../controllers/client.controller.ts"
import { requireRoles } from "../middlewares/auth.middleware.ts"
import { asyncHandler } from "../utils/async-handler.ts"

export const clientRouter = Router()

clientRouter.get("/", requireRoles(["admin"]), asyncHandler(controller.list))
clientRouter.get("/:id", requireRoles(["admin"]), asyncHandler(controller.findOne))
clientRouter.post("/", requireRoles(["admin"]), asyncHandler(controller.create))
clientRouter.put("/:id", requireRoles(["admin"]), asyncHandler(controller.update))
clientRouter.delete("/:id", requireRoles(["admin"]), asyncHandler(controller.remove))
