import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import { Request, Response } from 'express'
import User from '@models/user.model'
import bcrypt from 'bcrypt'
import { z } from 'zod'

export const changePassSchema = z.object({
     old_pass: z.string({ required_error: 'Mật khẩu cũ không được để trống' }).trim(),
     password: z.string({ required_error: 'Mật khẩu không được để trống' }).trim(),
})

export type ChangePassInput = z.infer<typeof changePassSchema>

export const changePass = async (req: Request, res: Response) => {
     const { old_pass, password } = req.body as ChangePassInput

     if (old_pass === password) throw new ApiError('Mật khẩu mới không được giống mật khẩu cũ', 409)

     const itemExist = await User.findByPk(req.user?.userId, { attributes: ['id', 'password'] })
     if (!itemExist) throw new ApiError('Tài khoản không tồn tại', 404)

     const checkPass = await bcrypt.compare(old_pass, itemExist.password)
     if (!checkPass) throw new ApiError('Mật khẩu không cũ không chính xác', 409)

     await itemExist.update({
          pass: await bcrypt.hash(password, 10),
     })

     sendJson(res, { id: itemExist.id }, 'Đổi mật khẩu thành công')
}
