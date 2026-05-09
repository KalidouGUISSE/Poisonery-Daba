import express from "express"
import swaggerUi from "swagger-ui-express"
import { env } from "./config/env.ts"
import { swaggerSpec } from "./docs/swagger.ts"
import { apiRouter } from "./routes/index.ts"
import { attachUser } from "./middlewares/auth.middleware.ts"
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.ts"
import {
  compressionMiddleware,
  corsMiddleware,
  helmetMiddleware,
  loggerMiddleware,
  rateLimitMiddleware,
} from "./middlewares/security.middleware.ts"

export function createApp() {
  const app = express()

  app.use(helmetMiddleware)
  app.use(corsMiddleware)
  app.use(rateLimitMiddleware)
  app.use(compressionMiddleware)
  app.use(loggerMiddleware)
  app.use(express.json({ limit: "1mb" }))
  app.use(express.urlencoded({ extended: true }))
  app.use(attachUser)

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get("/", (_req, res) => {
    res.json({
      service: "poissyshop-backend",
      docs: "/docs",
      health: `${env.apiPrefix}/health`,
    })
  })
  app.use(env.apiPrefix, apiRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
