import logger from '@common/logger'
import { Request, Response, NextFunction } from 'express'

export const requestMiddleware = (req: Request, res: Response, next: NextFunction) => {
     logger.init(req)
     next()
}
