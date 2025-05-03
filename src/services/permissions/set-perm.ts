import RolePermission from '@models/role-permission.model'
import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import { Request, Response } from 'express'
import Role from '@models/role.model'
import db from '@configs/db.config'
import { z } from 'zod'

export const setPermissionSchema = z.object({
     role_id: z.number({ required_error: 'role_id không được để trống' }),
     add: z.array(z.number()).optional().default([]),
     remove: z.array(z.number()).optional().default([]),
})

export type setPermissionInput = z.infer<typeof setPermissionSchema>

export const setPermission = async (req: Request, res: Response) => {
     const transaction = await db.transaction()
     try {
          const { role_id, add, remove } = req.body as setPermissionInput

          const roleExist = await Role.findByPk(role_id)
          if (!roleExist) throw new ApiError('Vai trò không tồn tại', 404)

          for (const item of add) {
               await RolePermission.create({ role_id, permission_id: item }, { transaction })
          }

          for (const item of remove) {
               await RolePermission.destroy({
                    where: { role_id, permission_id: item },
                    transaction,
               })
          }

          await transaction.commit()

          sendJson(res, { id: role_id }, 'Cập nhật quyền thành công')
     } catch (e) {
          await transaction.rollback()
          throw e
     }
}
