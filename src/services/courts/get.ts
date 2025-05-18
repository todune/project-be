import PaginationRes from '@common/utils/paginationRes'
import { sendJson } from '@common/utils/sendJson'
import Category from '@models/category.model'
import { Request, Response } from 'express'
import Court from '@models/court.model'
import { Op } from 'sequelize'
import moment from 'moment'
import TimeSlot from '@models/time-slot.model'

export const getCourts = async (req: Request, res: Response) => {
     const page = Math.max(1, parseInt(req.query.page as string) || 1)
     const limit = Math.max(1, parseInt(req.query.limit as string) || 10)
     const keyword = ((req.query.keyword as string) || '').trim()
     const categoryId = req.query.categoryId as string

     const keywordArray = keyword.split(/\s+/).filter((word) => word.length > 0)
     const whereCondition: any = {}

     if (keywordArray.length > 0) {
          whereCondition[Op.and] = keywordArray.map((term) => ({
               name: { [Op.iLike]: `%${term}%` },
               location: { [Op.iLike]: `%${term}%` },
          }))
     }

     if (categoryId && Number(categoryId)) {
          whereCondition.category_id = Number(categoryId)
     }

     const queryOptions = {
          order: [['id', 'DESC']],
          include: [{ model: Category, as: 'catCourtData' }],
          where: whereCondition,
     }

     const pagination = new PaginationRes(Court, queryOptions, { page, limit })
     const data = await pagination.paginate()

     // Lấy ngày hôm nay
     const today = moment().startOf('day')

     // Duyệt qua từng sân để kiểm tra trạng thái lịch
     const courtsWithScheduleStatus = await Promise.all(
          data.items.map(async (court: any) => {
               // Tìm slot cuối cùng có trong lịch cho sân này
               const lastSlot = await TimeSlot.findOne({
                    where: {
                         court_id: court.dataValues.id,
                         date: { [Op.gte]: today.toDate() },
                    },
                    order: [['date', 'DESC']],
                    attributes: ['date'],
               })

               let scheduleStatus = {
                    status: 'Chưa có lịch',
                    daysRemaining: 0,
                    lastScheduleDate: '',
               }

               if (lastSlot) {
                    // Tính số ngày còn lại
                    const lastScheduleDate = moment(lastSlot.date)
                    const daysRemaining = lastScheduleDate.diff(today, 'days')

                    let status = ''
                    if (daysRemaining <= 1) {
                         status = 'Sắp hết lịch (còn 1 ngày)'
                    } else if (daysRemaining <= 3) {
                         status = `Sắp hết lịch (còn ${daysRemaining} ngày)`
                    } else {
                         status = `Còn ${daysRemaining} ngày`
                    }

                    scheduleStatus = {
                         status,
                         daysRemaining,
                         lastScheduleDate: lastScheduleDate.format('DD/MM/YYYY'),
                    }
               }

               return {
                    ...court.dataValues,
                    scheduleStatus,
               }
          })
     )

     // sendJson(res, data)
     sendJson(res, {
          ...data,
          items: courtsWithScheduleStatus,
     })
}
