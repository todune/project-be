import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import { hashPw } from '@common/utils/hashPw'
import { Request, Response } from 'express'
import User from '@models/user.model'
import Role from '@models/role.model'
import { z } from 'zod'

export const updateUserSchema = z.object({
     username: z.string().optional(),
     password: z.string().optional(),
     full_name: z.string().optional(),
     email: z.string().optional(),
     phone_number: z.string().optional(),
     address: z.string().optional().nullable(),
     role_id: z.number().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const updateUser = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     const { username, email, phone_number, role_id, address, full_name, password } =
          req.body as UpdateUserInput

     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const userExist = await User.findByPk(id)
     if (!userExist) throw new ApiError('Người dùng không tồn tại', 404)

     // Check if username, email or phone_number exists when they are updated
     if (username) {
          const isNameExist = await User.findOne({ where: { username }, attributes: ['id'] })
          if (isNameExist && isNameExist.id !== id)
               throw new ApiError('Tên đăng nhập đã tồn tại', 409)
     }

     if (phone_number) {
          const isPhoneExist = await User.findOne({ where: { phone_number }, attributes: ['id'] })
          if (isPhoneExist && isPhoneExist.id !== id)
               throw new ApiError('Số điện thoại đã tồn tại', 409)
     }

     if (email) {
          const isEmailExist = await User.findOne({ where: { email }, attributes: ['id'] })
          if (isEmailExist && isEmailExist.id !== id) throw new ApiError('Email đã tồn tại', 409)
     }

     if (role_id) {
          const isRoleExist = await Role.findOne({ where: { id: role_id }, attributes: ['id'] })
          if (!isRoleExist) throw new ApiError('Vai trò không tồn tại', 409)
     }

     const updatedData: any = {
          username,
          full_name,
          email,
          phone_number,
          address,
          role_id,
     }

     if (password) {
          updatedData.password = await hashPw(password)
     }

     await userExist.update(updatedData)

     sendJson(res, { id: userExist.id }, 'Cập nhật người dùng thành công')
}
