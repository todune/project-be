import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Role from '@models/role.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const updateRoleSchema = z.object({
     name: z.string().nullable().optional(),
})

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>

export const updateRole = async (req: Request, res: Response) => {
     const body = req.body as UpdateRoleInput
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await Role.findByPk(id)
     if (!itemExist) throw new ApiError('Vai trò không tồn tại', 404)

     await itemExist.update(body)

     sendJson(res, { id }, 'Cập nhật vai trò thành công')
}
