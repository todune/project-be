import PaginationRes from '@common/utils/paginationRes'
import { sendJson } from '@common/utils/sendJson'
import Category from '@models/category.model'
import FoodItem from '@models/food.model'
import { Request, Response } from 'express'
import { Op } from 'sequelize'

export const getFoodItems = async (req: Request, res: Response) => {
     const page = Math.max(1, parseInt(req.query.page as string) || 1)
     const limit = Math.max(1, parseInt(req.query.limit as string) || 10)
     const keyword = ((req.query.keyword as string) || '').trim()

     const keywordArray = keyword.split(/\s+/).filter((word) => word.length > 0)
     const whereCondition: any = {}

     if (keywordArray.length > 0) {
          whereCondition[Op.and] = keywordArray.map((term) => ({
               name: { [Op.iLike]: `%${term}%` },
          }))
     }

     const queryOptions = {
          order: [['id', 'DESC']],
          where: whereCondition,
          include: [{ model: Category, as: 'catFoodData' }],
     }

     const pagination = new PaginationRes(FoodItem, queryOptions, { page, limit })
     const data = await pagination.paginate()

     sendJson(res, data)
}
