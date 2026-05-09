import { Router } from "express"
import { authRouter } from "./auth.routes.ts"
import { clientRouter } from "./client.routes.ts"
import { initialDataRouter } from "./initial-data.routes.ts"
import { notificationRouter } from "./notification.routes.ts"
import { productRouter } from "./product.routes.ts"
import { saleRouter } from "./sale.routes.ts"

export const apiRouter = Router()

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "poissyshop-backend" })
})

apiRouter.use("/auth", authRouter)
apiRouter.use("/initial-data", initialDataRouter)
apiRouter.use("/products", productRouter)
apiRouter.use("/sales", saleRouter)
apiRouter.use("/clients", clientRouter)
apiRouter.use("/notifications", notificationRouter)
