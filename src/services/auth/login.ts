import { createAccessToken, setAccessTokenCookie } from '@common/utils/tokenUtils'
import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import { AppMsg } from '@common/utils/appMsg'
import { Request, Response } from 'express'
import User from '@models/user.model'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import Role from '@models/role.model'

export const loginSchema = z.object({
     username: z.string({ required_error: AppMsg.require('username') }),
     password: z.string({ required_error: AppMsg.require('password') }),
})

export type loginInput = z.infer<typeof loginSchema>

export const login = async (req: Request, res: Response) => {
     const { username, password } = req.body as loginInput

     // 1. Tìm user theo username
     const user = await User.findOne({
          where: { username },
          attributes: ['id', 'password'],
          include: [
               {
                    model: Role,
                    as: 'roleData',
                    attributes: ['name'],
               },
          ],
     })
     if (!user) throw new ApiError('Tài khoản chưa được đăng ký', 404)

     // 2. So sánh password
     const isMatch = await bcrypt.compare(password, user.password)
     if (!isMatch) throw new ApiError('Tên đăng nhập hoặc mật khẩu không chính xác', 409)

     // 3. Nếu đúng, tạo token
     const token = createAccessToken(user.id)
     setAccessTokenCookie(res, token)

     // 4. Gửi kết quả
     sendJson(res, { token, user_id: user.id, role: user.roleData.name }, 'Đăng nhập thành công')
}
