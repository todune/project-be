import PaginationRes from '@common/utils/paginationRes'
import { sendJson } from '@common/utils/sendJson'
import Category from '@models/category.model'
import Court from '@models/court.model'
import { Request, Response } from 'express'
import { Op } from 'sequelize'

export const getCourts = async (req: Request, res: Response) => {
     const page = Math.max(1, parseInt(req.query.page as string) || 1)
     const limit = Math.max(1, parseInt(req.query.limit as string) || 10)
     const keyword = ((req.query.keyword as string) || '').trim()

     const keywordArray = keyword.split(/\s+/).filter((word) => word.length > 0)
     const whereCondition: any = {}

     if (keywordArray.length > 0) {
          whereCondition[Op.and] = keywordArray.map((term) => ({
               name: { [Op.iLike]: `%${term}%` },
               location: { [Op.iLike]: `%${term}%` },
          }))
     }

     const queryOptions = {
          order: [['id', 'DESC']],
          include: [{ model: Category, as: 'catCourtData' }],
          where: whereCondition,
     }

     const pagination = new PaginationRes(Court, queryOptions, { page, limit })
     const data = await pagination.paginate()

     sendJson(res, data)
}
