import PaginationRes from '@common/utils/paginationRes'
import { sendJson } from '@common/utils/sendJson'
import Booking from '@models/booking.model'
import Category from '@models/category.model'
import Court from '@models/court.model'
import EquipmentItem from '@models/equipment.model'
import FoodItem from '@models/food.model'
import ServiceOrder from '@models/service-order.model'
import TimeSlot from '@models/time-slot.model'
import User from '@models/user.model'
import { Request, Response } from 'express'
import { Op } from 'sequelize'

export const getBookings = async (req: Request, res: Response) => {
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
                              model: FoodItem,
                              as: 'foodOrderData',
                         },
                         {
                              model: EquipmentItem,
                              as: 'equipmentOrderData',
                         },
                    ],
               },
          ],
          order: [['id', 'DESC']],
     }

     const pagination = new PaginationRes(Booking, queryOptions, { page, limit })
     const data = await pagination.paginate()
     sendJson(res, data)
}
