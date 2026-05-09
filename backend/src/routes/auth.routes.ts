import { Router } from "express"
import * as controller from "../controllers/auth.controller.ts"
import { asyncHandler } from "../utils/async-handler.ts"

export const authRouter = Router()

authRouter.post("/login", asyncHandler(controller.login))
authRouter.post("/register", asyncHandler(controller.register))
authRouter.get("/profile", asyncHandler(controller.getProfile))
authRouter.put("/profile", asyncHandler(controller.updateProfile))