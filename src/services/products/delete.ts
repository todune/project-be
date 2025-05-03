import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Product from '@models/product.model'
import { Request, Response } from 'express'

export const deleteProduct = async (req: Request, res: Response) => {
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await Product.findByPk(id)
     if (!itemExist) throw new ApiError('Sản phẩm không tồn tại', 404)

     await itemExist.destroy()

     sendJson(res, { id }, 'Xóa sản phẩm thành công')
}
