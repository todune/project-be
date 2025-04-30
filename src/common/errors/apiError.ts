import { ErrorCode, ErrorCodeType } from '@common/interface'

interface ErrorResponse {
     success: false
     message: string
     errorCode: ErrorCodeType
     data?: any
}

export class ApiError extends Error {
     public readonly errorCode: ErrorCodeType
     public isOperational: boolean
     public readonly data?: any

     constructor(message: string, errorCode: ErrorCodeType, isOperational = true, data?: any) {
          super(message)
          this.name = this.constructor.name
          this.errorCode = errorCode
          this.isOperational = isOperational
          this.data = data

          Error.captureStackTrace(this, this.constructor)
          Object.setPrototypeOf(this, new.target.prototype)
     }

     // Helper static methods
     static badRequest(message: string, data?: any) {
          return new ApiError(message, ErrorCode.BAD_REQUEST, true, data)
     }

     static unauthorized(message: string, data?: any) {
          return new ApiError(message, ErrorCode.UNAUTHORIZED, true, data)
     }

     static forbidden(message: string, data?: any) {
          return new ApiError(message, ErrorCode.FORBIDDEN, true, data)
     }

     static notFound(message: string, data?: any) {
          return new ApiError(message, ErrorCode.NOT_FOUND, true, data)
     }

     static validation(message: string, data?: any) {
          return new ApiError(message, ErrorCode.VALIDATION_ERROR, true, data)
     }

     static internal(message: string, data?: any) {
          return new ApiError(message, ErrorCode.INTERNAL_ERROR, false, data)
     }

     toJSON(): ErrorResponse {
          return {
               success: false,
               message: this.message,
               errorCode: this.errorCode,
               data: this.data,
          }
     }
}
