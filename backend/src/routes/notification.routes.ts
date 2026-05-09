import { Router } from "express"
import * as controller from "../controllers/notification.controller.ts"
import { requireRoles } from "../middlewares/auth.middleware.ts"
import { asyncHandler } from "../utils/async-handler.ts"

export const notificationRouter = Router()

notificationRouter.get("/", requireRoles(["admin"]), asyncHandler(controller.list))
notificationRouter.get("/:id", requireRoles(["admin"]), asyncHandler(controller.findOne))
notificationRouter.post("/", requireRoles(["admin"]), asyncHandler(controller.create))
notificationRouter.put("/:id", requireRoles(["admin"]), asyncHandler(controller.update))
notificationRouter.delete("/:id", requireRoles(["admin"]), asyncHandler(controller.remove))
notificationRouter.post("/send", requireRoles(["admin"]), asyncHandler(controller.sendRestockNotification))
notificationRouter.get("/unread/count", requireRoles(["admin"]), asyncHandler(controller.getUnreadCount))
