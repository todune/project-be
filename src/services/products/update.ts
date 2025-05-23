import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Product from '@models/product.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const updateProductSchema = z.object({
     name: z.string().nullable().optional(),
     type: z.string().nullable().optional(),
     description: z.string().nullable().optional(),
     price: z.number().nullable().optional(),
     quantity: z.number().nullable().optional(),
     image_url: z.string().nullable().optional(),
     category_id: z.number().nullable().optional(),
})

export type UpdateProductInput = z.infer<typeof updateProductSchema>

export const updateProduct = async (req: Request, res: Response) => {
     const body = req.body as UpdateProductInput
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await Product.findByPk(id)
     if (!itemExist) throw new ApiError('Đồ sản phẩm không tồn tại', 404)

     await itemExist.update(body)

     sendJson(res, { id }, 'Cập nhật đồ sản phẩm thành công')
}
