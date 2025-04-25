import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'
import User from '../../models/users'
import { Validator } from '../../common/functions/validator'
import bcrypt from 'bcrypt'

const messageError = new MessageError()

export const resetPass = async (req: Request, res: Response) => {
     logger.init(req)

     const userId = req.user?.userId
     const { oldPass, pass } = req.body
     try {
          if (
               !Validator.isValid(oldPass) ||
               !Validator.isValid(pass) ||
               !userId
          ) {
               return res.status(400).json({
                    success: false,
                    message: MessageError.MISSING_INPUT,
               })
          }

          const user = await User.findOne({ where: { id: userId } })

          if (oldPass.toString() === pass.toString()) {
               return res.status(422).json({
                    success: false,
                    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
               })
          }

          const checkPass = await bcrypt.compare(oldPass, user?.dataValues.pass)
          if (!checkPass) {
               return res.status(409).json({
                    success: false,
                    message: 'Mật khẩu cũ không chính xác',
               })
          }

          await user?.update({
               pass: await bcrypt.hash(pass.trim(), 10),
          })

          return res.status(200).json({
               success: true,
               message: messageError.success('Đổi mật khẩu'),
          })
     } catch (error: any) {
          logger.error(
               '>> [auth/change.ts] reset pass failed: ' + error.message
          )
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
