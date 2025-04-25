import { NextFunction, Request, Response } from 'express'
import MessageError from '../error/message.error'
import logger from '../logger'
import { twoCharMap } from '../../constants/twoCharMap'
import { verify } from 'jsonwebtoken'
import { Order } from '../../models'

export const startsWithNumber = (str: string) => {
     return /^[A-Z]/.test(str)
}

export class PermissionService {
     static hasPermission(per: string = 'NO_PERMISSION') {
          return async (req: Request, res: Response, next: NextFunction) => {
               try {
                    let userId = req.user?.userId
                    const goalId = (req.query.goalId as string) ?? per
                    const controlNum = req.query.controlNum as string
                    const guestToken = req.query.guestToken
                    if (guestToken) {
                         console.log('has guest token and next')
                         return next()
                    }

                    const token = req.cookies?.id
                    const publicToken = req.cookies?.publicToken
                    if (!userId && token) {
                         verify(
                              token,
                              process.env.ACCESS_TOKEN_SECRET || '',
                              (err: any, data: any) => {
                                   if (err) {
                                        return res.status(401).json({
                                             success: false,
                                             message: MessageError.SESSION_EXPIRED,
                                        })
                                   }
                                   req.user = data
                                   userId = req.user?.userId
                              }
                         )
                    }
                    if (
                         (goalId !== 'NO_PERMISSION' &&
                              controlNum &&
                              startsWithNumber(goalId) &&
                              userId) ||
                         goalId?.length === 2
                    ) {
                         const identify =
                              goalId?.length === 2
                                   ? goalId
                                   : goalId?.split('-')[0]
                         // const getIdentify = DeviceHelpers.findChildrenById()

                         return res.status(403).json({
                              success: false,
                              message: MessageError.PERMISSION_DENIED,
                         })
                    }

                    // check guest
                    return next()
               } catch (error) {
                    next(error)
               }
          }
     }

     static async checkGuest(req: Request, res: Response, next: NextFunction) {
          // const { orderId } = req.params || req.body
          let orderId = req.params.orderId
          const guestToken = req.query.guestToken

          if (!orderId) orderId = req.body.orderId
          const token = req.cookies?.id

          if (!token) {
               if (orderId && guestToken) {
               }
               return res.status(401).json({
                    success: true,
                    message: MessageError.SESSION_EXPIRED,
               })
          }

          return next()
     }

     static async checkTokenReceive(
          req: Request,
          res: Response,
          next: NextFunction
     ) {
          const orderId = req.body.orderId
          const tokenReceive = req.body.tokenReceive

          if (!orderId || !tokenReceive) {
               return res.status(401).json({
                    success: true,
                    message: MessageError.SESSION_EXPIRED,
               })
          }

          const orderExisting = await Order.findOne({
               where: {
                    id: orderId,
                    tokenReceive,
               },
          })

          if (!orderExisting) {
               return res.status(401).json({
                    success: true,
                    message: MessageError.SESSION_EXPIRED,
               })
          }

          return next()
     }
}
