import { Request, Response, NextFunction } from 'express'
import logger from '../logger'

export const requestMiddleware = (
     req: Request,
     res: Response,
     next: NextFunction
) => {
     logger.init(req)
     next()
}
