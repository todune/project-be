// import { ApiError } from '@common/errors/apiError'
// import { sendJson } from '@common/utils/sendJson'
// import Slot from '@models/time-slot.model'
// import { Request, Response } from 'express'
// import { z } from 'zod'

// export const updateSlotSchema = z.object({
//      start_time: z.string().nullable().optional(),
//      end_time: z.string().nullable().optional(),
//      name: z.string().nullable().optional(),
// })

// export type UpdateSlotInput = z.infer<typeof updateSlotSchema>

// export const updateSlot = async (req: Request, res: Response) => {
//      const body = req.body as UpdateSlotInput
//      const id = Number(req.params.id)
//      if (!id || id === 0) throw new ApiError('id.invalid', 400)

//      const itemExist = await Slot.findByPk(id)
//      if (!itemExist) throw new ApiError('Khung giờ không tồn tại', 404)

//      await itemExist.update(body)

//      sendJson(res, { id }, 'Cập nhật khung giờ thành công')
// }
