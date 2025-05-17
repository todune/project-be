import PaginationRes from '@common/utils/paginationRes'
import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import TimeSlot from '@models/time-slot.model'
import Category from '@models/category.model'
import { Request, Response } from 'express'
import Court from '@models/court.model'
import moment from 'moment-timezone'
import { Op, or } from 'sequelize'

export const getCourtsByCus = async (req: Request, res: Response) => {
     const page = Math.max(1, parseInt(req.query.page as string) || 1)
     const limit = Math.max(1, parseInt(req.query.limit as string) || 10)
     const keyword = ((req.query.keyword as string) || '').trim()
     const categoryId = Number(req.query.categoryId)
     const rawDate = (req.query.rawDate as string) || ''

     if (rawDate && !moment.utc(rawDate, 'YYYY-MM-DD', true).isValid()) {
          throw new ApiError('Ngày lọc không hợp lệ (yyyy-mm-dd)', 400)
     }

     const date = rawDate
          ? moment.utc(rawDate, 'YYYY-MM-DD').startOf('day').toDate()
          : moment.utc().startOf('day').toDate()

     console.log('date format: ', date)

     const keywordArray = keyword.split(/\s+/).filter((word) => word.length > 0)
     const whereCondition: any = {}

     if (keywordArray.length > 0) {
          whereCondition[Op.and] = keywordArray.map((term) => ({
               name: { [Op.iLike]: `%${term}%` },
               location: { [Op.iLike]: `%${term}%` },
               code: { [Op.iLike]: `%${term}%` },
          }))
     }

     if (categoryId) {
          whereCondition.category_id = categoryId
     }

     const queryOptions = {
          order: [['id', 'DESC']],
          attributes: { exclude: 'config' },
          include: [
               { model: Category, as: 'catCourtData' },
               {
                    model: TimeSlot,
                    as: 'courtTimeSlots',
                    where: { date },
               },
          ],
          where: whereCondition,
     }

     const pagination = new PaginationRes(Court, queryOptions, { page, limit })
     const data = await pagination.paginate()

     sendJson(res, data)
}
