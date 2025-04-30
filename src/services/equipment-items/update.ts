import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import EquipmentItem from '@models/equipment.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const updateEquipmentItemSchema = z.object({
     name: z.string().nullable().optional(),
     description: z.string().nullable().optional(),
     price: z.number().nullable().optional(),
     quantity: z.number().nullable().optional(),
     image_url: z.string().nullable().optional(),
     category_id: z.number().nullable().optional(),
})

export type UpdateEquipmentItemInput = z.infer<typeof updateEquipmentItemSchema>

export const updateEquipmentItem = async (req: Request, res: Response) => {
     const body = req.body as UpdateEquipmentItemInput
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await EquipmentItem.findByPk(id)
     if (!itemExist) throw new ApiError('Thiết bị không tồn tại', 404)

     await itemExist.update(body)

     sendJson(res, { id }, 'Cập nhật thiết bị thành công')
}
