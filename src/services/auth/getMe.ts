import { sendJson } from '@common/utils/sendJson'
import { Request, Response } from 'express'
import logger from '@common/logger'
import { ApiError } from '@common/errors/apiError'
import { AppMsg } from '@common/utils/appMsg'
import User from '@models/user.model'
import Role from '@models/role.model'
import Permission from '@models/permission.model'

export const getMe = async (req: Request, res: Response) => {
     logger.info('>> [auth/getMe.ts]')

     const id = Number(req.user?.userId)
     if (!id) throw new ApiError(AppMsg.sessionExpired, 401)

     const data = await User.findByPk(id, {
          attributes: ['id', 'username', 'full_name', 'email', 'phone_number'],
          include: [
               {
                    model: Role,
                    as: 'roleData',
                    attributes: ['id', 'name'],
                    include: [
                         {
                              model: Permission,
                              as: 'rolePermissionsData',
                              attributes: ['name'],
                              through: { attributes: [] },
                         },
                    ],
               },
          ],
     })

     const permissions =
          data?.roleData?.dataValues?.rolePermissionsData?.map((p: any) => p?.dataValues?.name) ||
          []

     if (!data) throw new ApiError('Người dùng không tồn tại', 404)

     const dataFinal = {
          id: data.id,
          username: data.username,
          full_name: data.full_name,
          phone_number: data.phone_number,
          roleData: {
               id: data.roleData.id,
               name: data.roleData.name,
          },
          permissions,
     }
     sendJson(res, dataFinal)
}
