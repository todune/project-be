import PaginationRes from '@common/utils/paginationRes'
import { sendJson } from '@common/utils/sendJson'
import Booking from '@models/booking.model'
import Category from '@models/category.model'
import Court from '@models/court.model'
import Product from '@models/product.model'
import ServiceOrder from '@models/service-order.model'
import TimeSlot from '@models/time-slot.model'
import User from '@models/user.model'
import { Request, Response } from 'express'
import { col, fn, Op } from 'sequelize'

export const getBookings = async (req: Request, res: Response) => {
     const page = Math.max(1, parseInt(req.query.page as string) || 1)
     const limit = Math.max(1, parseInt(req.query.limit as string) || 10)
     const keyword = ((req.query.keyword as string) || '').trim()
     const status = (req.query.status as string) || 'Tất cả'

     const keywordArray = keyword.split(/\s+/).filter((word) => word.length > 0)
     const whereCondition: any = {}

     if (keywordArray.length > 0) {
          whereCondition[Op.and] = keywordArray.map((term) => ({
               name: { [Op.iLike]: `%${term}%` },
          }))
     }

     if (status !== 'Tất cả') {
          whereCondition.status = status
     }

     const queryOptions = {
          distinct: true,
          where: whereCondition,
          include: [
               {
                    model: TimeSlot,
                    as: 'timeSlotBookingData',
               },
               {
                    model: User,
                    as: 'userBookingData',
                    attributes: ['id', 'full_name', 'phone_number', 'email', 'username'],
               },
               {
                    model: Court,
                    as: 'courtBookingData',
                    attributes: ['id', 'name', 'code', 'location'],
                    include: [
                         {
                              model: Category,
                              as: 'catCourtData',
                         },
                    ],
               },
               {
                    model: ServiceOrder,
                    as: 'serviceOrderData',
                    include: [
                         {
                              model: Product,
                              as: 'productData',
                         },
                    ],
               },
          ],
          order: [['id', 'DESC']],
     }

     const pagination = new PaginationRes(Booking, queryOptions, { page, limit })
     const data = await pagination.paginate()

     const typeCounts = await Booking.findAll({
          attributes: ['status', [fn('COUNT', col('status')), 'count']],
          where: whereCondition,
          group: ['status'],
     })

     const menu: Record<string, number> = {
          'Tất cả': 0,
          Mới: 0,
          'Chờ thanh toán': 0,
          'Đã thanh toán': 0,
          Hủy: 0,
     }

     for (const item of typeCounts) {
          const typeName = item.status || 'unknown'
          const count = parseInt(item.dataValues.count)
          menu[typeName] = count
          menu.all += count
     }
     sendJson(res, { menu, data })
}
