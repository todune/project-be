import { sign, verify } from 'jsonwebtoken'
import 'dotenv/config'
import { Request, NextFunction, Response } from 'express'
import { eq } from 'drizzle-orm'
import MessageError from '../error/message.error'

export interface RoleType {
     [key: string]: string[]
}

export const createAccessToken = (userId: string): string => {
     const token = sign({ userId }, process.env.ACCESS_TOKEN_SECRET || '', {
          expiresIn: '3d',
     })

     return token
}

export const authenticateToken = async (
     req: Request,
     res: Response,
     next: NextFunction
) => {
     const token = req.cookies?.id

     if (token == null)
          return res.status(401).json({
               success: false,
               message: MessageError.SESSION_EXPIRED,
          })

     verify(
          token,
          process.env.ACCESS_TOKEN_SECRET || '',
          (err: any, data: any) => {
               if (err)
                    return res.status(401).json({
                         success: false,
                         message: MessageError.SESSION_EXPIRED,
                    })
               req.user = data
               next()
          }
     )
}

export const checkPermission = (name: string) => {
     return async (req: Request, res: Response, next: NextFunction) => {
          try {
               const userId = req.user?.userId

               if (!userId) {
                    return res.status(403).json({
                         success: false,
                         message: MessageError.SESSION_EXPIRED,
                    })
               }
               next()
          } catch (error) {
               next(error)
          }
     }
}

const cookieOpts = {
     httpOnly: true,
     //   secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
     maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
}

export const setAccessTokenCookie = (res: Response, token: string): void => {
     res.cookie('id', token, cookieOpts)
}

export const setPublicTokenCookie = (res: Response, token: string): void => {
     res.cookie('publicToken', token, {
          httpOnly: true,
          //   secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 3 days
     })
}

export const setGuestTokenCookie = (res: Response, token: string): void => {
     res.cookie('guestToken', token, {
          httpOnly: true,
          //   secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 3 days
     })
}

export const clearAuthCookies = (res: Response) => {
     res.clearCookie('id', cookieOpts)
}
