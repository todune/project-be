import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'

export const getAuth = async (req: Request, res: Response) => {
     logger.init(req)

     try {
          const userId = req.user?.userId

          if (!userId) {
               return res.status(401).json({
                    success: false,
                    message: MessageError.SESSION_EXPIRED,
               })
          }

          return res.status(200).json({
               success: true,
          })
     } catch (error: any) {
          logger.error('>> [users/get.ts] get users failed', error)
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
