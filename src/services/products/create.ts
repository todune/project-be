import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Product from '@models/product.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const createProductSchema = z.object({
     name: z.string({ required_error: 'Tên sản phẩm không được để trống' }),
     type: z.string({ required_error: 'Loại sản phẩm không được để trống' }),
     description: z.string().nullable().optional(),
     price: z.number({ required_error: 'Giá sản phẩm không được để trống' }),
     quantity: z.number().optional().default(0),
     image_url: z.string().nullable().optional(),
     category_id: z.number({ required_error: 'Danh mục sản phẩm không được để trống' }),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

export const createProduct = async (req: Request, res: Response) => {
     const { name, description, price, quantity, image_url, category_id } =
          req.body as CreateProductInput

     const isExist = await Product.findOne({ where: { name }, attributes: ['id'] })
     if (isExist) throw new ApiError('Tên sản phẩm đã tồn tại', 409)

     const data = await Product.create({
          name,
          description,
          price,
          quantity,
          image_url,
          category_id,
     })

     sendJson(res, { id: data.dataValues.id }, 'Tạo sản phẩm thành công')
}
