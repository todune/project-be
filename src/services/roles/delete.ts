import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Role from '@models/role.model'
import { Request, Response } from 'express'

export const deleteRole = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await Role.findByPk(id)
     if (!itemExist) throw new ApiError('Vai trò không tồn tại', 404)

     await itemExist.destroy()

     sendJson(res, { id }, 'Xóa vai trò thành công')
}
