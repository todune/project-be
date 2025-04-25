import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'
import User from '../../models/users'
import {
     createAccessToken,
     setAccessTokenCookie,
} from '../../common/functions/checkToken'
import { Validator } from '../../common/functions/validator'

const messageError = new MessageError()

export const login = async (req: Request, res: Response) => {
     logger.init(req)

     try {
          const { user, pass } = req.body

          if (!Validator.isValid(user) || !Validator.isValid(pass)) {
               return res.status(400).json({
                    success: false,
                    message: MessageError.MISSING_INPUT,
               })
          }

          const existingUser = await User.findOne({ where: { user } })
          if (!existingUser) {
               return res.status(422).json({
                    success: false,
                    message: messageError.errorNotExist('Tài khoản'),
               })
          }

          const isMatchPass = await bcrypt.compare(
               pass.toString(),
               existingUser.dataValues?.pass?.toString()
          )
          if (!isMatchPass) {
               return res.status(409).json({
                    success: false,
                    message: MessageError.INCORRECT_AUTH,
               })
          }

          const token = createAccessToken(existingUser.dataValues.id)

          setAccessTokenCookie(res, token)

          

          return res.status(200).json({
               success: true,
               message: messageError.success('Đăng nhập'),
               userId: existingUser.dataValues.id,
          })
     } catch (error: any) {
          logger.error('>> [auth/login.ts] login failed: ' + error.message)
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
