import { Request, Response, NextFunction } from 'express'
import { ApiError } from '@common/errors/apiError'
import { ErrorCode } from '@common/interface'
import logger from '@common/logger'
import { AppMsg } from '@common/utils/appMsg'

export class ErrorMiddleware {
     static handle(err: Error, req: Request, res: Response, next: NextFunction) {
          const requestInfo = {
               path: req.path,
               method: req.method,
               body: req.body,
               query: req.query,
               params: req.params,
               headers: req.headers,
               timestamp: new Date().toISOString(),
          }

          if (err instanceof ApiError) {
               // Log operational errors
               if (err.isOperational) {
                    // logger.warn('Operational Error:', {
                    //      name: err.name,
                    //      message: err.message,
                    //      errorCode: err.errorCode,
                    //      // errors: err.details,
                    //      request: requestInfo,
                    // })
               }
               // Log programming errors
               else {
                    logger.error('Programming Error:', {
                         name: err.name,
                         message: err.message,
                         errorCode: err.errorCode,
                         stack: err.stack,
                         request: requestInfo,
                    })
               }

               res.status(err.errorCode).json(err.toJSON())
               return
          }

          // Unknown errors
          logger.error('Unknown Error:', {
               name: err.name,
               message: err.message,
               stack: err.stack,
               request: requestInfo,
          })

          res.status(ErrorCode.INTERNAL_ERROR).json({
               success: false,
               message: AppMsg.serverError,
               statusCode: ErrorCode.INTERNAL_ERROR,
          })
          return
     }

     // Catch 404 errors
     static notFound(req: Request, res: Response, next: NextFunction) {
          next(new ApiError(`Resource not found: ${req.path}`, ErrorCode.NOT_FOUND))
     }
}
