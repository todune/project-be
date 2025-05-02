import { ApiError } from '@common/errors/apiError'
import { generateWeeklySchedule } from '@common/utils/generateSlot'
import { sendJson } from '@common/utils/sendJson'
import TimeSlot from '@models/time-slot.model'
import { Request, Response } from 'express'
import Court from '@models/court.model'
import db from '@configs/db.config'
import { z } from 'zod'

export const createTimeSlotSchema = z.object({
     court_id: z.number({ required_error: 'Sân không được để trống' }),
     start_date: z.string({ required_error: 'Ngày bắt đầu không được để trống' }),
     slotDuration: z.number({ required_error: 'Thời lượng mỗi ca bắt buộc phải có' }).positive(),
     openingHours: z.record(
          z.string().regex(/^[0-6]$/, 'Chỉ cho phép các giá trị từ 0 đến 6'),
          z.object({
               start: z.string().regex(/^\d{2}:\d{2}$/, 'Start time phải định dạng HH:mm'),
               end: z.string().regex(/^\d{2}:\d{2}$/, 'End time phải định dạng HH:mm'),
          })
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
          basePrice: z.number({ required_error: 'Giá cơ bản bắt buộc phải có' }).positive(),
          peakHourMultiplier: z
               .number({ required_error: 'Hệ số giờ cao điểm bắt buộc phải có' })
               .positive(),
          weekendMultiplier: z
               .number({ required_error: 'Hệ số cuối tuần bắt buộc phải có' })
               .positive(),
          peakHours: z.object({
               weekdays: z.array(
                    z.object({
                         start: z.string().regex(/^\d{2}:\d{2}$/),
                         end: z.string().regex(/^\d{2}:\d{2}$/),
                    })
               ),
               weekends: z.array(
                    z.object({
                         start: z.string().regex(/^\d{2}:\d{2}$/),
                         end: z.string().regex(/^\d{2}:\d{2}$/),
                    })
               ),
          }),
          nonOperationalDays: z.array(z.number().min(0).max(6)).optional(),
     }),
})

export type CreateTimeSlotInput = z.infer<typeof createTimeSlotSchema>

export const createTimeSlot = async (req: Request, res: Response) => {
     const transaction = await db.transaction()
     try {
          const { court_id, start_date, ...config } = req.body as CreateTimeSlotInput

          const isCourtExist = await Court.findByPk(court_id, { attributes: ['id'] })
          if (!isCourtExist) throw new ApiError('Sân không tồn tại', 404)

          const dataSlot = generateWeeklySchedule(new Date(start_date), config as any)

          await isCourtExist.update({ config }, { transaction })

          for (const item of dataSlot) {
               const prepareData = item.timeSlots.map((x) => ({ ...x, date: item.date, court_id }))
               await TimeSlot.bulkCreate(prepareData, { transaction })
          }

          await transaction.commit()
          sendJson(res, { id: court_id }, 'Thiết lập lịch thành công')
     } catch (e) {
          await transaction.rollback()
          throw e
     }
}
