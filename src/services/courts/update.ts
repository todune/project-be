import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import Court from '@models/court.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const updateCourtSchema = z.object({
     name: z.string().nullable().optional(),
     code: z.string().nullable().optional(),
     location: z.string().nullable().optional(),
     category_id: z.number().nullable().optional(),
})

export type UpdateCourtInput = z.infer<typeof updateCourtSchema>

export const updateCourt = async (req: Request, res: Response) => {
     const body = req.body as UpdateCourtInput
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await Court.findByPk(id)
     if (!itemExist) throw new ApiError('Sân không tồn tại', 404)

     await itemExist.update(body)

     sendJson(res, { id }, 'Cập nhật sân thành công')
}
