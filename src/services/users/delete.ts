import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import { Request, Response } from 'express'
import User from '@models/user.model'

export const deleteUser = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await User.findByPk(id)
     if (!itemExist) throw new ApiError('Người dùng không tồn tại', 404)

     await itemExist.destroy()

     sendJson(res, { id }, 'Xóa người dùng thành công')
}
