import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'
import User from '../../models/users'
import { Validator } from '../../common/functions/validator'
import { generateFourDigitCode } from '../../common/functions/generateFourDigitCode'
import { sendMail } from '../../common/functions/sendMail'

const messageError = new MessageError()

const sendOtpCode = async (email: string) => {
     const otpCode = generateFourDigitCode()
     sendMail(email, 'Khôi phục tài khoản', 'Mã OTP của bạn là: ' + otpCode)
     return otpCode
}

export const forgotPass = async (req: Request, res: Response) => {
     logger.init(req)

     const { email } = req.body
     try {
          if (!Validator.isValid(email)) {
               return res.status(400).json({
                    success: false,
                    message: MessageError.MISSING_INPUT,
               })
          }

          const otpCode = await sendOtpCode(email)

          await User.update({ otpCode }, { where: { email } })

          return res.status(200).json({
               success: true,
               message: messageError.success('Thao tác'),
          })
     } catch (error: any) {
          logger.error(
               '>> [auth/forgot.ts] forgot pass failed: ' + error.message
          )
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
