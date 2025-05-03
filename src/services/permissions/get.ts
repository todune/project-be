import { ApiError } from '@common/errors/apiError'
import Permission from '@models/permission.model'
import { Request, Response } from 'express'
import Role from '@models/role.model'

export const getPermissions = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const allPermissions = await Permission.findAll({
          attributes: ['id', 'name', 'type'],
     })

     const userPermissionList = await Permission.findAll({
          attributes: ['id', 'name', 'type'],
          include: [
               {
                    model: Role,
                    as: 'permissionRolesData',
                    attributes: [],
                    required: true,
                    where: { id },
               },
          ],
     })

     const userPermissions = new Set()

     userPermissionList.forEach((permission) => {
          userPermissions.add(permission.id)
     })
     const groupedPermissions: any = allPermissions.reduce((groups: any, permission: any) => {
          const type = permission.type || 'unknown'
          if (!groups[type]) {
               groups[type] = []
          }
          groups[type].push({
               id: permission.id,
               name: permission.name,
               type: permission.type,
               checked: userPermissions.has(permission.id),
          })
          return groups
     }, {})

     const data = Object.fromEntries(
          Object.entries(groupedPermissions).sort(
               ([, a], [, b]) => (b as any).length - (a as any).length
          )
     )

     return res.status(200).json({
          statusCode: 200,
          success: true,
          message: 'Success',
          data,
     })
}
