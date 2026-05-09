import { Router } from "express"
import { getInitialData, getDashboardStats } from "../controllers/initial-data.controller.ts"
import { asyncHandler } from "../utils/async-handler.ts"

export const initialDataRouter = Router()

initialDataRouter.get("/", asyncHandler(getInitialData))
initialDataRouter.get("/dashboard", asyncHandler(getDashboardStats))
