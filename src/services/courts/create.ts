import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Court from '@models/court.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const createCourtSchema = z.object({
     name: z.string({ required_error: 'Tên sân không được để trống' }),
     code: z.string({ required_error: 'Mã sân không được để trống' }),
     location: z.string({ required_error: 'Vị trí không được để trống' }),
     image_url: z.string().optional().nullable(),
     description: z.string().optional().nullable(),
     category_id: z.number({ required_error: 'Danh mục không được để trống' }),
})

export type CreateCourtInput = z.infer<typeof createCourtSchema>

export const createCourt = async (req: Request, res: Response) => {
     const { name, ...rest } = req.body as CreateCourtInput

     const isExist = await Court.findOne({ where: { name }, attributes: ['id'] })
     if (isExist) throw new ApiError('Tên sân đã tồn tại', 409)

     const data = await Court.create({ name, ...rest })

     sendJson(res, { id: data.dataValues.id }, 'Tạo sân thành công')
}
