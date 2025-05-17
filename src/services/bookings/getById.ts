import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import { Request, Response } from 'express'
import Court from '@models/court.model'
import Booking from '@models/booking.model'
import TimeSlot from '@models/time-slot.model'
import User from '@models/user.model'
import ServiceOrder from '@models/service-order.model'
import Product from '@models/product.model'

export const getBookingById = async (req: Request, res: Response) => {
     console.log('running....')
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const data = await Booking.findByPk(id, {
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
     })

     if (!data) throw new ApiError('Không tìm thấy thông tin vé', 404)

     sendJson(res, data)
}
