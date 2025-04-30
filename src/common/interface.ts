export enum HttpStatus {
     OK = 200,
     BAD_REQUEST = 400,
     UNAUTHORIZED = 401,
     FORBIDDEN = 403,
     NOT_FOUND = 404,
     VALIDATION_ERROR = 422,
     INTERNAL_ERROR = 500,
     TOO_MANY_REQUESTS = 429,
}

export enum ErrorType {
     VALIDATION = 'VALIDATION_ERROR',
     AUTHENTICATION = 'AUTHENTICATION_ERROR',
     AUTHORIZATION = 'AUTHORIZATION_ERROR',
     NOT_FOUND = 'NOT_FOUND',
     BAD_REQUEST = 'BAD_REQUEST',
     INTERNAL = 'INTERNAL_ERROR',
     TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
}

export interface ErrorMetadata {
     type: ErrorType
     code: HttpStatus
     message: string
}

export const ErrorCode = {
     BAD_REQUEST: 400,
     UNAUTHORIZED: 401,
     FORBIDDEN: 403,
     NOT_FOUND: 404,
     CONFLICT: 409,
     VALIDATION_ERROR: 422,
     INTERNAL_ERROR: 500,
     TOO_MANY_REQUESTS: 429,
} as const

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]

export const ErrorMessages: Record<ErrorType, string> = {
     [ErrorType.VALIDATION]: 'Validation failed',
     [ErrorType.AUTHENTICATION]: 'Authentication failed',
     [ErrorType.AUTHORIZATION]: 'You do not have permission',
     [ErrorType.NOT_FOUND]: 'Resource not found',
     [ErrorType.BAD_REQUEST]: 'Bad request',
     [ErrorType.INTERNAL]: 'Internal server error',
     [ErrorType.TOO_MANY_REQUESTS]: 'Too many request',
}

export type FileType = 'image' | 'xlsx' | 'docx' | 'mp4' | 'txt' | 'unknown'

export enum UploadType {
     IMAGE = 'image',
     FILE = 'file',
}
