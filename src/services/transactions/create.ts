import Transaction from '@models/transaction.model'
import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import TimeSlot from '@models/time-slot.model'
import { Request, Response } from 'express'
import Booking from '@models/booking.model'
import moment from 'moment-timezone'
import db from '@configs/db.config'
import sequelize from 'sequelize'
import { z } from 'zod'
import { sendBookingTicketToUser } from '@common/utils/sendMail'
import Category from '@models/category.model'
import Court from '@models/court.model'
import User from '@models/user.model'
import SportCenter from '@models/sport-center.model'

export const createTransactionSchema = z.object({
     booking_id: z.number({ required_error: 'booking_id không được để trống' }),
     amount: z.string({ required_error: 'amount không được để trống' }),
     response_time: z.number({ required_error: 'response_time không được để trống' }),
     signature: z.string({ required_error: 'signature không được để trống' }),
     pay_type: z.string({ required_error: 'pay_type không được để trống' }),
     trans_id: z.string({ required_error: 'trans_id không được để trống' }),
     result_code: z.number({ required_error: 'result_code không được để trống' }),
     status: z.string().optional().nullable(),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>

export const createTransaction = async (req: Request, res: Response) => {
     const transaction = await db.transaction({
          isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
     })
     try {
          const { booking_id, response_time, trans_id, ...rest } =
               req.body as CreateTransactionInput

          // 1. check transaction is handled
          const existingTransaction = await Transaction.findOne({
               where: { trans_id },
               transaction,
          })
          if (existingTransaction) throw new ApiError('Transaction đã được xử lý trước đó', 400)

          // 2. check booking is exist
          const booking = await Booking.findByPk(booking_id, {
               attributes: ['id', 'time_slot_id', 'status', 'user_id', 'court_id', 'total_price'],
               include: [
                 {
                   model: User,
                   as: 'userBookingData',
                   attributes: ['full_name', 'email']
                 },
                 {
                   model: Court,
                   as: 'courtBookingData',
                   attributes: ['name', 'location'],
                   include: [
                     {
                       model: Category,
                       as: 'catCourtData',
                       attributes: ['name']
                     }
                   ]
                 },
                 {
                   model: TimeSlot,
                   as: 'timeSlotBookingData',
                   attributes: ['date', 'start_time', 'end_time']
                 }
               ],
               transaction,
             })
          if (!booking) throw new ApiError('Khung giờ đặt không tồn tại', 404)
          if (booking.status !== 'Chờ thanh toán')
               throw new ApiError('Trạng thái booking không hợp lệ', 400)

          // 3. update booking is paid
          await booking.update({ status: 'Đã thanh toán' }, { transaction })

          // 4. update time slot is booked
          await TimeSlot.update(
               { lock_expires_at: null, is_booked: true },
               { where: { id: booking.time_slot_id }, transaction }
          )

          // 5. create transaction
          await Transaction.create(
               {
                    ...rest,
                    booking_id,
                    trans_id,
                    response_time: moment.utc(response_time).format('YYYY-MM-DD HH:mm:ss'),
               },
               { transaction }
          )

          const sportCenter = await SportCenter.findByPk(1)

          const bookingInfo = {
               booking_id: booking.dataValues.id,
               customerName: booking.dataValues.userBookingData.full_name,
               customerEmail: booking.dataValues.userBookingData.email,
               courtName: booking.dataValues.courtBookingData.name,
               categoryName: booking.dataValues.courtBookingData.catCourtData.name,
               courtLocation: booking.dataValues.courtBookingData.location,
               bookingDate: moment(booking.dataValues.timeSlotBookingData.date).format('DD/MM/YYYY'),
               startTime: booking.dataValues.timeSlotBookingData.start_time,
               endTime: booking.dataValues.timeSlotBookingData.end_time,
               totalPrice: new Intl.NumberFormat('vi-VN', {
                 style: 'currency',
                 currency: 'VND'
               }).format(booking.dataValues.total_price),
               sportCenter: sportCenter?.dataValues
             }
             
             await sendBookingTicketToUser(bookingInfo)

          await transaction.commit()
          sendJson(res, { id: booking_id }, 'Thanh toán thành công')
     } catch (e) {
          await transaction.rollback()
          throw e
     }
}
