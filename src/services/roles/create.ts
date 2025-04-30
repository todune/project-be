import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Role from '@models/role.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const createRoleSchema = z.object({
     name: z.string({ required_error: 'Tên vai trò không được để trống' }),
})

export type CreateRoleInput = z.infer<typeof createRoleSchema>

export const createRole = async (req: Request, res: Response) => {
     const { name } = req.body as CreateRoleInput

     const isExist = await Role.findOne({ where: { name }, attributes: ['id'] })
     if (isExist) throw new ApiError('Tên vai trò đã tồn tại', 409)

     const role = await Role.create({ name })

     sendJson(res, { id: role.dataValues.id }, 'Tạo vai trò thành công')
}
