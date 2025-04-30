import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Slot from '@models/slot.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const createSlotSchema = z.object({
     start_time: z.string({ required_error: 'Thời gian bắt đầu không được để trống' }),
     end_time: z.string({ required_error: 'Thời gian kết thúc không được để trống' }),
     name: z.string({ required_error: 'Tên khung giờ không được để trống' }),
})

export type CreateSlotInput = z.infer<typeof createSlotSchema>

export const createSlot = async (req: Request, res: Response) => {
     const { start_time, end_time, name } = req.body as CreateSlotInput

     const isExist = await Slot.findOne({ where: { name }, attributes: ['id'] })
     if (isExist) throw new ApiError('Tên khung giờ đã tồn tại', 409)

     const slot = await Slot.create({ start_time, end_time, name })

     sendJson(res, { id: slot.dataValues.id }, 'Tạo khung giờ thành công')
}
