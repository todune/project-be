import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'

const messageError = new MessageError()

export const deleteCategory = async (req: Request, res: Response) => {
     logger.init(req)

     try {

          return res.status(200).json({
               success: true,
               message: messageError.successMessageDelete('danh mục'),
          })
     } catch (error: any) {
          logger.error(
               '>> [categories/delete.ts] delete category device failed',
               error
          )
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
