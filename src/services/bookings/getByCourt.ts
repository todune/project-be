// import { ApiError } from '@common/errors/apiError'
// import PaginationRes from '@common/utils/paginationRes'
// import { sendJson } from '@common/utils/sendJson'
// import Court from '@models/court.model'
// import Slot from '@models/time-slot.model'
// import { Request, Response } from 'express'
// import { Op } from 'sequelize'

// export const getBookingByCourt = async (req: Request, res: Response) => {
//      const id = Number(req.params.id)
//      if (!id || id === 0) throw new ApiError('id.invalid', 400)

//      const itemExist = await Court.findByPk(id, { attributes: ['id'] })
//      if (!itemExist) throw new ApiError('Sân không tồn tại', 404)

//      const whereCondition: any = {}

//      // const data = await 

//      sendJson(res, { id })
// }
