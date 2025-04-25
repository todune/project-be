import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'
import { Op } from 'sequelize'
import PaginationRes from '../../common/functions/paginationRes'
import { Booking } from '../../models'

export const getBookings = async (req: Request, res: Response) => {
     logger.init(req)

     try {
          const page = Math.max(1, parseInt(req.query.page as string) || 1)
          const limit = Math.max(1, parseInt(req.query.limit as string) || 30)
          const keyword = req.query.keyword as string
          const categoryId = req.query.categoryId as string

          const search = keyword
               ? {
                      [Op.or]: { name: { [Op.iLike]: `%${keyword}%` } },
                 }
               : {}

          let where = categoryId && !keyword ? { id: categoryId } : {}

          const paginationOptions = {
               limit,
               page,
          }

          const queryOptions = {
               order: [['createdAt', 'DESC']],
               where: !categoryId && keyword ? search : where,
          }

          const pagination = new PaginationRes(
               Booking,
               queryOptions,
               paginationOptions
          )

          const data = await pagination.paginate()

          return res.status(200).json({
               success: true,
               data
          })
     } catch (error: any) {
          logger.error(
               '>> [categories/get.ts] get categories device failed',
               error
          )
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
