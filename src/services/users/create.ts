import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import { hashPw } from '@common/utils/hashPw'
import { Request, Response } from 'express'
import User from '@models/user.model'
import Role from '@models/role.model'
import { z } from 'zod'

export const createUserSchema = z.object({
     username: z.string({ required_error: 'Tên đăng nhập không được để trống' }),
     password: z.string({ required_error: 'Mật khẩu không được để trống' }),
     full_name: z.string({ required_error: 'Họ tên không được để trống' }),
     email: z.string({ required_error: 'Email không được để trống' }),
     phone_number: z.string({ required_error: 'Số điện thoại không được để trống' }),
     address: z.string().nullable().optional(),
     role_id: z.number({ required_error: 'Vai trò không được để trống' }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const createUser = async (req: Request, res: Response) => {
     const { username, email, phone_number, role_id, address, full_name, password } =
          req.body as CreateUserInput

     const isNameExist = await User.findOne({ where: { username }, attributes: ['id'] })
     if (isNameExist) throw new ApiError('Tên đăng nhập đã tồn tại', 409)

     const isPhoneExist = await User.findOne({ where: { phone_number }, attributes: ['id'] })
     if (isPhoneExist) throw new ApiError('Số điện thoại đã tồn tại', 409)

     const isEmailExist = await User.findOne({ where: { email }, attributes: ['id'] })
     if (isEmailExist) throw new ApiError('Email đã tồn tại', 409)

     const isRoleExist = await Role.findOne({ where: { id: role_id }, attributes: ['id'] })
     if (!isRoleExist) throw new ApiError('Vai trò không tồn tại', 409)

     const data = await User.create({
          username,
          email,
          phone_number,
          role_id,
          address,
          full_name,
          password: await hashPw(password),
     })

     sendJson(res, { id: data.dataValues.id }, 'Tạo người dùng')
}
