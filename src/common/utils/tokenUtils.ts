import { Request, NextFunction, Response } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { AppMsg } from './appMsg'
import 'dotenv/config'

export const createAccessToken = (userId: number): string => {
     const token = sign({ userId }, process.env.ACCESS_TOKEN_SECRET || '', {
          expiresIn: '7d',
     })

     return token
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
     const token = req.cookies?.id

     if (token == null)
          return res.status(401).json({
               success: false,
               message: AppMsg.sessionExpired,
          })

     verify(token, process.env.ACCESS_TOKEN_SECRET || '', (err: any, data: any) => {
          if (err)
               return res.status(401).json({
                    success: false,
                    message: AppMsg.sessionExpired,
               })
          req.user = data
          next()
     })
}

export const checkPermission = (name: string) => {
     return async (req: Request, res: Response, next: NextFunction) => {
          try {
               const userId = req.user?.userId

               if (!userId) {
                    return res.status(403).json({
                         success: false,
                         message: AppMsg.sessionExpired,
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
     secure: true,
     sameSite: 'none',
     maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
}

export const setAccessTokenCookie = (res: Response, token: string): void => {
     res.cookie('id', token, cookieOpts as any)
}

export const clearAuthCookies = (res: Response) => {
     res.clearCookie('id', cookieOpts as any)
}
