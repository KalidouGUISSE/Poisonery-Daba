import dotenv from "dotenv"

dotenv.config()

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback
  return value.toLowerCase() === "true"
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: toNumber(process.env.PORT, 4000),
  apiPrefix: process.env.API_PREFIX ?? "/api",
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/poissyshop",
  jwtSecret: process.env.JWT_SECRET ?? "development-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  rateLimitWindowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: toNumber(process.env.RATE_LIMIT_MAX, 300),
  authRequired: toBoolean(process.env.AUTH_REQUIRED, false),
  saleDecrementsStock: toBoolean(process.env.SALE_DECREMENTS_STOCK, false),
  defaultAdminUsername: process.env.DEFAULT_ADMIN_USERNAME ?? "admin",
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD ?? "admin123",
  defaultSellerUsername: process.env.DEFAULT_SELLER_USERNAME ?? "vendeur1",
  defaultSellerPassword: process.env.DEFAULT_SELLER_PASSWORD ?? "vendeur123",
}
