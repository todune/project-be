import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'
import { clearAuthCookies } from '../../common/functions/checkToken'

const messageError = new MessageError()

export const logout = async (req: Request, res: Response) => {
     try {
          clearAuthCookies(res)

          return res.status(200).json({
               success: true,
               message: messageError.success('Đăng xuất'),
          })
     } catch (error: any) {
          logger.error('logout error' + error.message)
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
