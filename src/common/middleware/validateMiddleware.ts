import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export const validateMiddleware =
     (schema: ZodSchema<any>, source: 'body' | 'query' | 'params' = 'body') =>
     (req: Request, res: Response, next: NextFunction) => {
          const result = schema.safeParse(req[source])
          if (!result.success) {
               return res.status(400).json({
                    message: 'Validation failed',
                    errors: result.error.flatten().fieldErrors,
               })
          }

          req[source] = result.data
          next()
     }
