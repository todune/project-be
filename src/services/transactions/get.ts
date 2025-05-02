import PaginationRes from '@common/utils/paginationRes'
import { sendJson } from '@common/utils/sendJson'
import Transaction from '@models/transaction.model'
import { Request, Response } from 'express'
import { Op } from 'sequelize'

export const getTransactions = async (req: Request, res: Response) => {
     const page = Math.max(1, parseInt(req.query.page as string) || 1)
     const limit = Math.max(1, parseInt(req.query.limit as string) || 10)
     const keyword = ((req.query.keyword as string) || '').trim()

     const keywordArray = keyword.split(/\s+/).filter((word) => word.length > 0)
     const whereCondition: any = {}

     if (keywordArray.length > 0) {
          whereCondition[Op.and] = keywordArray.map((term) => ({
               signature: { [Op.iLike]: `%${term}%` },
          }))
     }

     const queryOptions = {
          order: [['id', 'DESC']],
          where: whereCondition,
     }

     const pagination = new PaginationRes(Transaction, queryOptions, { page, limit })
     const data = await pagination.paginate()

     sendJson(res, data)
}
