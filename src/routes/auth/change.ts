import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'
import User from '../../models/users'
import { Validator } from '../../common/functions/validator'
import bcrypt from 'bcrypt'


const messageError = new MessageError()

export const changePass = async (req: Request, res: Response) => {
     logger.init(req)

     const { email, pass, tokenResetPass } = req.body
     try {
          if (!Validator.isValid(email) || !Validator.isValid(pass)) {
               return res.status(400).json({
                    success: false,
                    message: MessageError.MISSING_INPUT,
               })
          }

          const user = await User.findOne({ where: { email } })

          if (tokenResetPass.toString() !== user?.dataValues?.tokenResetPass) {
               return res.status(400).json({
                    success: false,
                    message: MessageError.VERIFY_FAIL,
               })
          }

          const hashPass = await bcrypt.hash(pass, 10)
          const userData = await user?.update({ pass : hashPass, tokenResetPass: null })

          return res.status(200).json({
               success: true,
               message: messageError.success('Đổi mật khẩu'),
          })
     } catch (error: any) {
          logger.error(
               '>> [auth/change.ts] change pass failed: ' + error.message
          )
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
