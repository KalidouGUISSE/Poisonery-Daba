import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Charger les variables d'environnement
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
