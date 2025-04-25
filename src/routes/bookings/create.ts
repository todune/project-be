import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'
import { Validator } from '../../common/functions/validator'
import { Booking } from '../../models'

const messageError = new MessageError()

export const createCategory = async (req: Request, res: Response) => {
     logger.init(req)

     try {
          const { name, code, note } = req.body

          // await Booking.create({
          //      user_id: req.userId,
          // })

          return res.status(200).json({
               success: true,
               message: messageError.successMessageAdd('danh mục'),
          })
     } catch (error: any) {
          logger.error(
               '>> [categories/create.ts] create category device failed',
               error
          )
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
