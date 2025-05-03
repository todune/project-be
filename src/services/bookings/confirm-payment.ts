import { createPayMoMoUrl } from '@common/utils/createPaymentUrl'
import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import TimeSlot from '@models/time-slot.model'
import Booking from '@models/booking.model'
import { Request, Response } from 'express'
import { Transaction } from 'sequelize'
import db from '@configs/db.config'
import moment from 'moment-timezone'
import { z } from 'zod'
import 'dotenv/config'

export const confirmPaymentSchema = z.object({
     user_id: z.number({ required_error: 'user_id không được để trống' }),
     redirect_url: z.string({ required_error: 'redirect_url không được để trống' }),
})

export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>

export const confirmPayment = async (req: Request, res: Response) => {
     const transaction = await db.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
     })
     const id = Number(req.params.id)
     if (!id) throw new ApiError('id.invalid', 400)

     const { user_id, redirect_url } = req.body as ConfirmPaymentInput

     try {
          // 1. check time slot exist
          const timeSlot = await TimeSlot.findByPk(id, {
               attributes: ['id', 'lock_expires_at', 'is_booked'],
          })
          if (!timeSlot) throw new ApiError('Khung giờ đặt không tồn tại', 404)

          // 2. check booking exist
          const booking = await Booking.findOne({
               attributes: ['id', 'total_price', 'status'],
               where: { user_id, time_slot_id: id },
               order: [['id', 'desc']],
               transaction,
          })
          if (!booking) throw new ApiError('Sân không tồn tại', 404)
          console.log(booking.id)

          // 3. booking is paid
          if (booking.status === 'Đã thanh toán') {
               await transaction.commit()
               sendJson(res, booking, 'Sân này đã được thanh toán trước đó')
               return
          }

          const now = moment.utc()

          // 3. time slot is booked -> check lock time expire
          if (timeSlot.is_booked) {
               console.log('lock expires at: ', timeSlot.lock_expires_at)
               console.log('now: ', now)
               if (timeSlot.lock_expires_at && moment(timeSlot.lock_expires_at).isAfter(now)) {
                    await transaction.commit()
                    sendJson(
                         res,
                         { id },
                         'Khung giờ bạn chọn đang được giữ bởi người khác. Vui lòng thử lại sau hoặc chọn khung giờ khác.'
                    )
                    return
               }
          }

          // 4. create payment url
          const payUrl = await createPayMoMoUrl({
               orderId: `${booking.id}`,
               amount: booking.total_price,
               redirectUrl: redirect_url,
               ipnUrl: 'https://callback.url/notify',
          })

          // lock time slot
          const holdUntil = now
               .clone()
               .add(parseInt(process.env.LOCK_TIME_SLOT || '2'), 'minutes')
               .toDate()
          console.log('holdUntil: ', holdUntil)
          await TimeSlot.update(
               { lock_expires_at: holdUntil, is_booked: true },
               { where: { id }, transaction }
          )

          // 5. update booking to wait payment
          await booking.update({ status: 'Chờ thanh toán' }, { transaction })

          await transaction.commit()
          sendJson(
               res,
               { id, payUrl },
               'Xác nhận giữ sân thành công. Vui lòng thanh toán trong 5 phút.'
          )
     } catch (e) {
          // unlock time slot
          await transaction.rollback()
          await unlockTimeSlot(id, transaction)
          throw e
     }
}

async function unlockTimeSlot(id: number, transaction: Transaction) {
     await TimeSlot.update({ lock_expires_at: null, is_booked: false }, { where: { id } })
}
