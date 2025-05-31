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
     const startTime = (req.query.startTime as string) || ''
     const endTime = (req.query.endTime as string) || ''

     if (rawDate && !moment.utc(rawDate, 'YYYY-MM-DD', true).isValid()) {
          throw new ApiError('Ngày lọc không hợp lệ (yyyy-mm-dd)', 400)
     }

     const date = rawDate
          ? moment.utc(rawDate, 'YYYY-MM-DD').startOf('day').toDate()
          : moment.utc().startOf('day').toDate()

     const keywordArray = keyword.split(/\s+/).filter((word) => word.length > 0)
     const whereCondition: any = {}

     if (keywordArray.length > 0) {
          whereCondition[Op.and] = keywordArray.map((term) => ({
               name: { [Op.iLike]: `%${term}%` },
               // location: { [Op.iLike]: `%${term}%` },
               // code: { [Op.iLike]: `%${term}%` },
          }))
     }

     if (categoryId) {
          whereCondition.category_id = categoryId
     }

     const timeSlotWhere: any = { date }
     // Thêm điều kiện lọc theo giờ nếu có
     if (startTime && endTime) {
          console.log('Filtering by time range:', { startTime, endTime })

          timeSlotWhere[Op.and] = [
               {
                    [Op.or]: [
                         // Slot bắt đầu trong khoảng thời gian
                         {
                              start_time: {
                                   [Op.between]: [startTime, endTime],
                              },
                         },
                         // Slot kết thúc trong khoảng thời gian
                         {
                              end_time: {
                                   [Op.between]: [startTime, endTime],
                              },
                         },
                         // Slot bao trùm khoảng thời gian
                         {
                              [Op.and]: [
                                   { start_time: { [Op.lte]: startTime } },
                                   { end_time: { [Op.gte]: endTime } },
                              ],
                         },
                    ],
               },
          ]
     }

     const queryOptions = {
          order: [['id', 'DESC']],
          attributes: { exclude: 'config' },
          include: [
               { model: Category, as: 'catCourtData' },
               {
                    model: TimeSlot,
                    as: 'courtTimeSlots',
                    where: timeSlotWhere,
               },
          ],
          where: whereCondition,
     }

     const pagination = new PaginationRes(Court, queryOptions, { page, limit })
     const data = await pagination.paginate()

     // Lọc thêm các TimeSlot để chỉ hiển thị những slot trong khoảng thời gian (nếu cần)
     if (startTime && endTime && data.items) {
          data.items = data.items
               .map((court: any) => {
                    const filteredTimeSlots = court.dataValues.courtTimeSlots.filter(
                         (slot: any) => {
                              return isTimeInRange(
                                   slot.start_time,
                                   startTime as string,
                                   endTime as string
                              )
                         }
                    )

                    return {
                         ...court.toJSON(),
                         courtTimeSlots: filteredTimeSlots,
                    }
               })
               .filter((court) => court.courtTimeSlots.length > 0) // Chỉ giữ court có slot phù hợp
     }

     sendJson(res, data)
}

// Helper function để kiểm tra thời gian có nằm trong khoảng không
const isTimeInRange = (timeToCheck: string, startTime: string, endTime: string): boolean => {
     const timeToMinutes = (timeString: string): number => {
          const [hours, minutes] = timeString.split(':').map(Number)
          return hours * 60 + minutes
     }

     const checkMinutes = timeToMinutes(timeToCheck)
     const startMinutes = timeToMinutes(startTime)
     const endMinutes = timeToMinutes(endTime)

     // Xử lý trường hợp qua ngày (22:00 - 06:00)
     if (startMinutes > endMinutes) {
          return checkMinutes >= startMinutes || checkMinutes <= endMinutes
     }

     return checkMinutes >= startMinutes && checkMinutes <= endMinutes
}
