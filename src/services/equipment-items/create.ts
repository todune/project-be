import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import EquipmentItem from '@models/equipment.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const createEquipmentItemSchema = z.object({
     name: z.string({ required_error: 'Tên thiết bị không được để trống' }),
     description: z.string().nullable().optional(),
     price: z.number({ required_error: 'Giá thiết bị không được để trống' }),
     quantity: z.number().optional().default(0),
     image_url: z.string().nullable().optional(),
     category_id: z.number({ required_error: 'Danh mục thiết bị không được để trống' }),
})

export type CreateEquipmentItemInput = z.infer<typeof createEquipmentItemSchema>

export const createEquipmentItem = async (req: Request, res: Response) => {
     const { name, description, price, quantity, image_url, category_id } =
          req.body as CreateEquipmentItemInput

     const isExist = await EquipmentItem.findOne({ where: { name }, attributes: ['id'] })
     if (isExist) throw new ApiError('Tên thiết bị đã tồn tại', 409)

     const equipmentItem = await EquipmentItem.create({
          name,
          description,
          price,
          quantity,
          image_url,
          category_id,
     })

     sendJson(res, { id: equipmentItem.dataValues.id }, 'Tạo thiết bị thành công')
}
