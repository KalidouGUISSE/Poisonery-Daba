import { createApp } from "./app.js"
import { connectDatabase, disconnectDatabase } from "./config/database.js"
import { env } from "./config/env.js"

async function bootstrap() {
  await connectDatabase()

  const app = createApp()
  const server = app.listen(env.port, () => {
    console.log(`PoissyShop backend running on http://localhost:${env.port}`)
    console.log(`Swagger docs available on http://localhost:${env.port}/docs`)
  })

  const shutdown = async () => {
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
  }

  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
}

bootstrap().catch((error) => {
  console.error("Failed to start backend", error)
  process.exit(1)
})
