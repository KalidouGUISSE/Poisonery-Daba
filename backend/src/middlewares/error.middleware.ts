import type { ErrorRequestHandler } from "express"
import { ZodError } from "zod"
import { env } from "../config/env.js"
import { HttpError } from "../utils/http-error.js"

export const notFoundHandler = () => {
  throw new HttpError(404, "Route introuvable")
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      message: "Les données envoyées sont invalides",
      details: error.flatten(),
    })
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    })
  }

  const statusCode = typeof error.statusCode === "number" ? error.statusCode : 500

  return res.status(statusCode).json({
    error: statusCode === 500 ? "Erreur interne du serveur" : error.message,
    details: env.nodeEnv === "production" ? undefined : error.stack,
  })
}
