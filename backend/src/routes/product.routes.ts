import { Router } from "express"
import * as controller from "../controllers/product.controller.ts"
import { requireRoles } from "../middlewares/auth.middleware.ts"
import { asyncHandler } from "../utils/async-handler.ts"

export const productRouter = Router()

productRouter.get("/", asyncHandler(controller.list))
productRouter.get("/categories", asyncHandler(controller.getCategories))
productRouter.get("/:id", asyncHandler(controller.findById))
productRouter.put("/:id", requireRoles(["admin", "vendeur"]), asyncHandler(controller.update))
productRouter.delete("/:id", requireRoles(["admin"]), asyncHandler(controller.remove))

/**
 * @swagger
 * /products/categories:
 *   get:
 *     tags: [Produits]
 *     summary: Récupérer les catégories de produits
 *     description: Retourne la liste de toutes les catégories de produits disponibles
 *     responses:
 *       200:
 *         description: Catégories récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Poisson frais", "Crustacés", "Coquillages"]
 */
productRouter.get("/categories", asyncHandler(controller.getCategories))
