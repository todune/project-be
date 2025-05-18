import { ApiError } from '@common/errors/apiError'
import { generateWeeklySchedule } from '@common/utils/generateSlot'
import { sendJson } from '@common/utils/sendJson'
import db from '@configs/db.config'
import Court from '@models/court.model'
import TimeSlot from '@models/time-slot.model'
import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { z } from 'zod'

export const updateTimeSlotSchema = z.object({
     court_id: z.number().optional(),
     start_date: z.string().optional(),
     slotDuration: z.number().positive().optional(),
     openingHours: z.record(
          z
               .string()
               .regex(/^[0-6]$/, 'Chỉ cho phép các giá trị từ 0 đến 6')
               .optional(),
          z
               .object({
                    start: z.string().regex(/^\d{2}:\d{2}$/, 'Start time phải định dạng HH:mm'),
                    end: z.string().regex(/^\d{2}:\d{2}$/, 'End time phải định dạng HH:mm'),
               })
               .optional()
     ),
     blockedDates: z.array(z.date()).optional(),
     recurringBlocks: z
          .array(
               z.object({
                    weekday: z.number().min(0).max(6),
                    start: z.string().regex(/^\d{2}:\d{2}$/),
                    end: z.string().regex(/^\d{2}:\d{2}$/),
               })
          )
          .optional(),
     weeklySettings: z.object({
          basePrice: z.number().positive().optional(),
          peakHourMultiplier: z.number().positive().optional(),
          weekendMultiplier: z.number().positive().optional(),
          peakHours: z.object({
               weekdays: z
                    .array(
                         z.object({
                              start: z.string().regex(/^\d{2}:\d{2}$/),
                              end: z.string().regex(/^\d{2}:\d{2}$/),
                         })
                    )
                    .optional(),
               weekends: z
                    .array(
                         z.object({
                              start: z.string().regex(/^\d{2}:\d{2}$/),
                              end: z.string().regex(/^\d{2}:\d{2}$/),
                         })
                    )
                    .optional(),
          }),
          nonOperationalDays: z.array(z.number().min(0).max(6)).optional(),
     }),
})

export type UpdateTimeSlotInput = z.infer<typeof updateTimeSlotSchema>

export const updateTimeSlot = async (req: Request, res: Response) => {
     const transaction = await db.transaction()
     try {
          const id = Number(req.params.id)
          const body = req.body as UpdateTimeSlotInput

          if (!id || id === 0) throw new ApiError('id.invalid', 400)

          // Lấy timeSlot theo id
          // const slot = await TimeSlot.findByPk(id)
          // if (!slot) throw new ApiError('Khung giờ không tồn tại', 404)

          const court_id = body.court_id

          // Kiểm tra sân
          const court = await Court.findByPk(court_id)
          if (!court) throw new ApiError('Sân không tồn tại', 404)

          // Nếu không có start_date thì không thể regenerate lịch
          const start_date = body.start_date
          if (!start_date) throw new ApiError('Ngày bắt đầu không hợp lệ', 400)

          // Cập nhật cấu hình sân (gộp với config cũ)
          const newConfig = {
               ...court.config,
               ...body,
          }
          await court.update({ config: newConfig }, { transaction })

          // Xóa các slot cũ (nếu cần, theo ngày bắt đầu và court)
          await TimeSlot.destroy({
               where: { court_id, date: { [Op.gte]: new Date(start_date) }, is_booked: false },
               transaction,
          })

          // Tạo lại khung giờ mới
          const dataSlot = generateWeeklySchedule(new Date(start_date), newConfig as any)
          for (const item of dataSlot) {
               const prepareData = item.timeSlots.map((x) => ({
                    ...x,
                    date: item.date,
                    court_id,
               }))
               await TimeSlot.bulkCreate(prepareData, { transaction })
          }

          await transaction.commit()
          sendJson(res, { id: court_id }, 'Cập nhật lịch thành công')
     } catch (error) {
          await transaction.rollback()
          throw error
     }
}
