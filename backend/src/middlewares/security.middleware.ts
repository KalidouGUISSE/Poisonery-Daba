import compression from "compression"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import morgan from "morgan"
import { env } from "../config/env.js"

export const helmetMiddleware = helmet()

export const corsMiddleware = cors({
  origin: env.corsOrigin.split(",").map((origin) => origin.trim()),
  credentials: true,
})

export const rateLimitMiddleware = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

export const compressionMiddleware = compression()

export const loggerMiddleware = morgan(env.nodeEnv === "production" ? "combined" : "dev")
