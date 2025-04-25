import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'
import bcrypt from 'bcrypt';
import User from '../../models/users';


const messageError = new MessageError()

export const register = async (req: Request, res: Response) => {
     logger.init(req)

     try {
          const { user, pass } = req.body

          // Validate input
          if (!user && !pass) {
               return res.status(400).json({
                    success: false,
                    message: messageError.errorRequired('Tên đăng nhập và mật khẩu'),
               });
          } else if (!user) {
               return res.status(400).json({
                    success: false,
                    message: messageError.errorRequired('Tên đăng nhập'),
               });
          } else if (!pass) {
               return res.status(400).json({
                    success: false,
                    message: messageError.errorRequired('Mật khẩu'),
               });
          }

          // Check if user already exists
          const existingUser = await User.findOne({ where: { user } });
          if (existingUser) {
               return res.status(400).json({
                    success: false,
                    message: messageError.errorExist('Tên đăng nhập'),
               });
          }

          // Hash the password
          const hashedPassword = await bcrypt.hash(pass, 10);

          // Create the user
          await User.create({ user, pass: hashedPassword });


          return res.status(200).json({
               success: true,
               // data
          })
     } catch (error: any) {
          logger.error('register error' + error.message)
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
