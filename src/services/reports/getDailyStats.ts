import { Request, Response } from 'express'
import Booking from '@models/booking.model'
import User from '@models/user.model'
import { Sequelize, Op } from 'sequelize'
import moment from 'moment-timezone'
import { ApiError } from '@common/errors/apiError'

export const getDailyStats = async (req: Request, res: Response) => {
     try {
          const rawDate = (req.query.rawDate as string) || ''
          if (rawDate && !moment.utc(rawDate, 'YYYY-MM-DD', true).isValid()) {
               throw new ApiError('Ngày lọc không hợp lệ (yyyy-mm-dd)', 400)
          }

          const selectedDate = moment(rawDate)

          const dayStart = selectedDate.startOf('day').toDate()
          const dayEnd = selectedDate.endOf('day').toDate()

          const dailyRevenue =
               (await Booking.sum('total_price', {
                    where: {
                         status: 'Đã thanh toán',
                         created_at: {
                              [Op.between]: [dayStart, dayEnd],
                         },
                    },
               })) || 0

          const dailyRefund =
               (await Booking.sum('total_price', {
                    where: {
                         status: 'Hoàn tiền',
                         created_at: {
                              [Op.between]: [dayStart, dayEnd],
                         },
                    },
               })) || 0

          return res.status(200).json({
               statusCode: 200,
               success: true,
               message: 'Success',
               data: {
                    dailyRevenue,
                    dailyRefund,
               },
          })
     } catch (error) {
          console.error('Error fetching dashboard stats:', error)
          return res.status(500).json({
               statusCode: 500,
               success: false,
               message: 'Internal server error',
               error,
          })
     }
}
