import TimeSlot from '@models/time-slot.model'
import moment from 'moment-timezone'
import db from '@configs/db.config'
import sequelize from 'sequelize'
import { Op } from 'sequelize'
import cron from 'node-cron'

// Cron job chạy mỗi 30 phút để lock các slot đã quá thời gian
export function expiredSlotCronJob() {
     cron.schedule('*/1 * * * *', async () => {
          console.log('Running cron job to lock expired time slots...')

          const transaction = await db.transaction({
               isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
          })

          try {
               const currentMoment = moment()
               const currentDate = currentMoment.format('YYYY-MM-DD')
               const currentTime = currentMoment.format('HH:mm:ss')
               const currentDateTime = currentMoment.format('YYYY-MM-DD HH:mm:ss')

               console.log('Checking slots for date:', currentDate, 'current time:', currentTime)

               // Tìm các slot đã quá thời gian nhưng chưa được lock
               const expiredSlots = await TimeSlot.findAll({
                    where: {
                         [Op.and]: [
                              // Điều kiện 1: Chưa được lock và chưa được book
                              {
                                   is_locked: false
                              },
                              {
                                   is_booked: false
                              },
                              // Điều kiện 2: Slot đã expired (so sánh datetime)
                              db.where(
                                   db.fn('CONCAT', db.col('date'), ' ', db.col('start_time')),
                                   {
                                        [Op.lte]: currentDateTime
                                   }
                              )
                         ]
                    },
                    attributes: ['id', 'date', 'start_time', 'end_time', 'court_id'],
                    transaction
               })

               if (expiredSlots.length === 0) {
                    console.log('No expired slots found to lock')
                    await transaction.commit()
                    return
               }

               console.log(`Found ${expiredSlots.length} expired slots to lock:`)

               // Lock từng slot
               for (const slot of expiredSlots) {
                    await slot.update(
                         {
                              is_locked: true,
                              lock_expires_at: null // Clear lock expiration vì đây là lock vĩnh viễn
                         },
                         { transaction }
                    )

                    console.log(`✅ Locked expired slot ID: ${slot.id}, Court: ${slot.court_id}, Time: ${slot.start_time}-${slot.end_time}`)
               }

               await transaction.commit()
               console.log(`✅ Successfully locked ${expiredSlots.length} expired time slots`)

          } catch (error) {
               await transaction.rollback()
               console.error('❌ Error in expired slot cron job:', error)
          }
     })

     console.log('📅 Expired slot cron job initialized - runs every 30 minutes')
}

// Cron job bổ sung chạy mỗi ngày lúc 00:05 để lock tất cả slot của ngày hôm trước
export function dailySlotCleanupCronJob() {
     cron.schedule('5 0 * * *', async () => {
          console.log('Running daily cleanup to lock all previous day slots...')

          const transaction = await db.transaction({
               isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
          })

          try {
               const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD')

               console.log('Locking all slots from yesterday:', yesterday)

               // Lock tất cả slot của ngày hôm trước (trừ những slot đã booked)
               const updatedCount = await TimeSlot.update(
                    {
                         is_locked: true,
                         lock_expires_at: null
                    },
                    {
                         where: {
                              date: yesterday,
                              is_locked: false,
                              is_booked: false
                         },
                         transaction
                    }
               )

               await transaction.commit()
               console.log(`✅ Daily cleanup completed - locked ${updatedCount[0]} slots from ${yesterday}`)

          } catch (error) {
               await transaction.rollback()
               console.error('❌ Error in daily slot cleanup cron job:', error)
          }
     })

     console.log('📅 Daily slot cleanup cron job initialized - runs daily at 00:05')
}