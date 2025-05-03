import TimeSlot from '@models/time-slot.model'
import Booking from '@models/booking.model'
import moment from 'moment-timezone'
import db from '@configs/db.config'
import sequelize from 'sequelize'
import { Op } from 'sequelize'
import cron from 'node-cron'

// Cron job chạy mỗi 2 phút để kiểm tra các booking đã hết thời gian thanh toán
export function timeSlotCronJob() {
     cron.schedule('*/2 * * * *', async () => {
          console.log('Running cron job to free expired timeslots...')
          const transaction = await db.transaction({
               isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
          })
          try {
               const currentTime = moment.utc()
               console.log('current time: ', currentTime)

               const expiredTimeSlots = await TimeSlot.findAll({
                    where: {
                         lock_expires_at: {
                              [Op.lt]: currentTime.toDate(),
                         },
                    },
                    transaction,
               })

               for (const timeSlot of expiredTimeSlots) {
                    const bookingsForSlot = await Booking.findAll({
                         where: {
                              time_slot_id: timeSlot.id,
                              status: 'Chờ thanh toán',
                         },
                         transaction,
                    })

                    for (const booking of bookingsForSlot) {
                         await booking.update({ status: 'Hủy' }, { transaction })
                         console.log(
                              `Booking ID ${booking.id} has been unlocked for TimeSlot ID ${timeSlot.id}`
                         )
                    }

                    // unlock time slot
                    await timeSlot.update(
                         {
                              lock_expires_at: null,
                              is_booked: false,
                         },
                         { transaction }
                    )

                    console.log(`TimeSlot ID ${timeSlot.id} has been unlocked`)
               }

               await transaction.commit()
          } catch (error) {
               await transaction.rollback()
               console.error('Error running cron job:', error)
          }
     })
}
