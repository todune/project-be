import { ApiError } from '@common/errors/apiError'
import { sendJson } from '@common/utils/sendJson'
import SportCenter from '@models/sport-center.model'
import { Request, Response } from 'express'
import { z } from 'zod'

export const updateSportCenterSchema = z.object({
     name: z.string().nullable().optional(),
     description: z.string().nullable().optional(),
     image_url: z.string().nullable().optional(),
     location: z.string().nullable().optional(),
     address: z.string().nullable().optional(),
     phone_number: z.string().nullable().optional(),
     email: z.string().nullable().optional(),
})

export type UpdateSportCenterInput = z.infer<typeof updateSportCenterSchema>

export const updateSportCenter = async (req: Request, res: Response) => {
     const body = req.body as UpdateSportCenterInput
     const id = Number(req.params.id)
     if (!id || id === 0) throw new ApiError('id.invalid', 400)

     const itemExist = await SportCenter.findByPk(id)
     if (!itemExist) throw new ApiError('Trung tâm thể thao không tồn tại', 404)

     await itemExist.update(body)

     sendJson(res, { id }, 'Cập nhật  thành công')
}
