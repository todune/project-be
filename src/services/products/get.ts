import PaginationRes from '@common/utils/paginationRes'
import { sendJson } from '@common/utils/sendJson'
import Category from '@models/category.model'
import Product from '@models/product.model'
import { Request, Response } from 'express'
import { col, fn, Op } from 'sequelize'

export const getProducts = async (req: Request, res: Response) => {
     const page = Math.max(1, parseInt(req.query.page as string) || 1)
     const limit = Math.max(1, parseInt(req.query.limit as string) || 10)
     const keyword = ((req.query.keyword as string) || '').trim()
     const type = (req.query.type as string) || 'Tất cả'

     const keywordArray = keyword.split(/\s+/).filter((word) => word.length > 0)
     const whereCondition: any = {}
     const whereCount: any = {}

     if (keywordArray.length > 0) {
          const keywordFilter = keywordArray.map((term) => ({
               name: { [Op.iLike]: `%${term}%` },
               description: { [Op.iLike]: `%${term}%` },
          }))
          whereCondition[Op.and] = keywordFilter
          whereCount[Op.and] = keywordFilter
     }

     if (type !== 'Tất cả') {
          whereCondition.type = type
     }

     const queryOptions = {
          order: [['id', 'DESC']],
          where: whereCondition,
          include: [{ model: Category, as: 'catProductData' }],
     }

     const pagination = new PaginationRes(Product, queryOptions, { page, limit })
     const data = await pagination.paginate()

     const typeCounts = await Product.findAll({
          attributes: ['type', [fn('COUNT', col('type')), 'count']],
          where: whereCount,
          group: ['type'],
     })

     const menu: Record<string, number> = {
          'Tất cả': 0,
          'Đồ ăn, uống': 0,
          'Trang thiết bị': 0,
     }

     for (const item of typeCounts) {
          const typeName = item.type || 'unknown'
          const count = parseInt(item.dataValues.count)
          menu[typeName] = count
          menu['Tất cả'] += count
     }

     sendJson(res, { menu, data })
}
