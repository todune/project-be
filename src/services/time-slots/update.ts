import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import TimeSlot from '@models/time-slot.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const updateTimeSlotSchema = z.object({
     start_time: z.string().nullable().optional(),
     end_time: z.string().nullable().optional(),
     name: z.string().nullable().optional(),
})

export type UpdateTimeSlotInput = z.infer<typeof updateTimeSlotSchema>

export const updateTimeSlot = async (req: Request, res: Response) => {
     const body = req.body as UpdateTimeSlotInput
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await TimeSlot.findByPk(id)
     if (!itemExist) throw new ApiError('Khung giờ không tồn tại', 404)

     await itemExist.update(body)

     sendJson(res, { id }, 'Cập nhật khung giờ thành công')
}
