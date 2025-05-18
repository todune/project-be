import { Request, Response } from 'express'
import Booking from '@models/booking.model'
import Court from '@models/court.model'
import Category from '@models/category.model'
import { Sequelize, Op } from 'sequelize'
import moment from 'moment'

export const getTopBookedCourts = async (req: Request, res: Response) => {
     try {
          const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5

          // Get date range for filtering (default: last 30 days)
          const days = req.query.days ? parseInt(req.query.days as string, 10) : 30
          const startDate = moment().subtract(days, 'days').startOf('day').toDate()

          // Query the most booked courts
          const topCourts = await Booking.findAll({
               attributes: [
                    [Sequelize.col('court_id'), 'courtId'],
                    [Sequelize.col('courtBookingData.name'), 'name'],
                    [Sequelize.col('courtBookingData.location'), 'location'],
                    [Sequelize.col('courtBookingData.image_url'), 'image_url'],
                    [Sequelize.col('courtBookingData.description'), 'description'],
                    [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'bookingCount'],
               ],
               include: [
                    {
                         model: Court,
                         as: 'courtBookingData',
                         attributes: [],
                         include: [
                              {
                                   model: Category,
                                   as: 'catCourtData',
                                   attributes: [],
                              },
                         ],
                    },
               ],
               where: {
                    created_at: {
                         [Op.gte]: startDate,
                    },
                    status: {
                         [Op.in]: ['Đã thanh toán', 'Mới'],
                    },
               },
               group: ['court_id', 'courtBookingData.id', 'courtBookingData.catCourtData.id'],
               order: [[Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'DESC']],
               limit: limit,
          })

          return res.status(200).json({
               statusCode: 200,
               success: true,
               message: 'Success',
               data: topCourts,
          })
     } catch (error) {
          console.error('Error fetching top booked courts:', error)
          return res.status(500).json({
               statusCode: 500,
               success: false,
               message: 'Internal server error',
               error,
          })
     }
}
