import type { NextFunction, Request, Response } from "express"
import type { AnyZodObject, ZodTypeAny } from "zod"

type ValidationSchema = {
  body?: AnyZodObject | ZodTypeAny
  query?: AnyZodObject | ZodTypeAny
  params?: AnyZodObject | ZodTypeAny
}

export function validate(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schema.body) req.body = schema.body.parse(req.body)
    if (schema.query) req.query = schema.query.parse(req.query) as Request["query"]
    if (schema.params) req.params = schema.params.parse(req.params) as Request["params"]
    next()
  }
}
