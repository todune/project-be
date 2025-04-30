import PaginationRes from '@common/utils/paginationRes'
import { sendJson } from '@common/utils/sendJson'
import Role from '@models/role.model'
import User from '@models/user.model'
import { Request, Response } from 'express'
import { Op } from 'sequelize'

export const getUsers = async (req: Request, res: Response) => {
     const page = Math.max(1, parseInt(req.query.page as string) || 1)
     const limit = Math.max(1, parseInt(req.query.limit as string) || 10)
     const keyword = ((req.query.keyword as string) || '').trim()

     const keywordArray = keyword.split(/\s+/).filter((word) => word.length > 0)
     const whereCondition: any = {}

     if (keywordArray.length > 0) {
          whereCondition[Op.and] = keywordArray.map((term) => ({
               full_name: { [Op.iLike]: `%${term}%` },
               username: { [Op.iLike]: `%${term}%` },
               phone_number: { [Op.iLike]: `%${term}%` },
               email: { [Op.iLike]: `%${term}%` },
          }))
     }

     const queryOptions = {
          order: [['id', 'DESC']],
          attributes: { exclude: ['password'] },
          include: [{ model: Role, as: 'roleData' }],
          where: whereCondition,
     }

     const pagination = new PaginationRes(User, queryOptions, { page, limit })
     const data = await pagination.paginate()

     sendJson(res, data)
}
