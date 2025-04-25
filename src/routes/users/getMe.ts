import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'

export const getMe = async (req: Request, res: Response) => {
     logger.init(req)
     try {
          const userId = req.user?.userId

          

          return res.status(200).json({
               success: true,
               // result: data,
          })
     } catch (error: any) {
          logger.error('get me >> ' + error.message)
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
