import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'
import User from '../../models/users'
import { Validator } from '../../common/functions/validator'
import { generateFourDigitCode } from '../../common/functions/generateFourDigitCode'

export const verifyOtp = async (req: Request, res: Response) => {
     logger.init(req)

     const { email, otpCode } = req.body
     try {
          if (!Validator.isValid(email) || !Validator.isValid(otpCode)) {
               return res.status(400).json({
                    success: false,
                    message: MessageError.MISSING_INPUT,
               })
          }

          const user = await User.findOne({ where: { email } })

          if (otpCode.toString() !== user?.dataValues?.otpCode.toString()) {
               return res.status(400).json({
                    success: false,
                    message: MessageError.VERIFY_FAIL,
               })
          }

          const tokenResetPass =
               crypto.randomUUID() +
               parseInt(generateFourDigitCode()) / 2 +
               37373
          await User.update({ tokenResetPass }, { where: { email } })

          return res.status(200).json({
               success: true,
               message: MessageError.VERIFY_OK,
               tokenResetPass,
          })
     } catch (error: any) {
          logger.error(
               '>> [auth/verify.ts] verify otp code failed: ' + error.message
          )
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
