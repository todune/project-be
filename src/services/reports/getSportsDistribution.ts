import { Request, Response } from 'express'
import Booking from '@models/booking.model'
import Court from '@models/court.model'
import Category from '@models/category.model'
import { Sequelize, Op } from 'sequelize'

export const getSportsDistribution = async (req: Request, res: Response) => {
     try {
          // Query bookings grouped by sport category
          const bookingsBySport = await Booking.findAll({
               attributes: [
                    [Sequelize.col('courtBookingData.catCourtData.name'), 'sportName'],
                    [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'count'],
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
                                   where: {
                                        type: 'Thể thao',
                                   },
                              },
                         ],
                    },
               ],
               where: {
                    // Only include completed bookings
                    status: 'Đã thanh toán',
               },
               group: [Sequelize.col('courtBookingData.catCourtData.name')],
               order: [[Sequelize.literal('count'), 'DESC']],
          })

          // Format the data for the frontend
          const formattedData = bookingsBySport.map((item) => ({
               name: item.dataValues.sportName,
               value: parseInt(item.dataValues.count, 10),
          }))

          return res.status(200).json({
               statusCode: 200,
               success: true,
               message: 'Success',
               data: formattedData,
          })
     } catch (error) {
          console.error('Error fetching sports distribution:', error)
          return res.status(500).json({
               statusCode: 500,
               success: false,
               message: 'Internal server error',
               error,
          })
     }
}
