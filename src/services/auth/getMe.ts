import { sendJson } from '@common/utils/sendJson'
import { Request, Response } from 'express'
import logger from '@common/logger'
import { ApiError } from '@common/errors/apiError'
import { AppMsg } from '@common/utils/appMsg'
import User from '@models/user.model'
import Role from '@models/role.model'

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
               },
          ],
     })

     if (!data) throw new ApiError('Người dùng không tồn tại', 404)

     sendJson(res, data)
}
