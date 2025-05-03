import { Request, Response, NextFunction } from 'express'
import { ApiError } from '@common/errors/apiError'
import Permission from '@models/permission.model'
import Role from '@models/role.model'
import User from '@models/user.model'

export function permMiddleware(perm: string) {
     return async (req: Request, res: Response, next: NextFunction) => {
          try {
               const userId = Number(req.user?.userId)

               if (!userId) {
                    throw new ApiError('Phiên đăng nhập của bạn đã hết hạn', 401)
               }

               const data = await User.findByPk(userId, {
                    attributes: ['id', 'role_id'],
                    include: [
                         {
                              model: Role,
                              as: 'roleData',
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
                    data?.roleData?.dataValues?.rolePermissionsData?.map(
                         (p: any) => p?.dataValues?.name
                    ) || []

               const hasPermission = permissions.includes(perm)

               if (!hasPermission)
                    throw new ApiError('Bạn không có quyền thực hiện thao tác này', 403)

               return next()
          } catch (error) {
               return next(error)
          }
     }
}
