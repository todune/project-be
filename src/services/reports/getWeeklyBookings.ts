import { Request, Response } from 'express'
import Booking from '@models/booking.model'
import { Sequelize, Op } from 'sequelize'
import moment from 'moment-timezone'

export const getWeeklyBookings = async (req: Request, res: Response) => {
     try {
          // Get the start of the current week (Monday) and following Sunday
          const startOfWeek = moment().startOf('week').add(1, 'day').toDate() // Monday
          const endOfWeek = moment().endOf('week').add(1, 'day').toDate() // Sunday

          // Query booking counts for each day of the week
          const bookingsByDay = await Booking.findAll({
               attributes: [
                    [Sequelize.fn('date_trunc', 'day', Sequelize.col('created_at')), 'date'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
               ],
               where: {
                    created_at: {
                         [Op.between]: [startOfWeek, endOfWeek],
                    },
               },
               group: [Sequelize.fn('date_trunc', 'day', Sequelize.col('created_at'))],
               order: [[Sequelize.literal('date'), 'ASC']],
          })

          // Format the data for the frontend
          const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
          const formattedData = daysOfWeek.map((day, index) => {
               const date = moment(startOfWeek).add(index, 'days').format('YYYY-MM-DD')
               const bookingData = bookingsByDay.find(
                    (b) => moment(b.dataValues.date).format('YYYY-MM-DD') === date
               )

               return {
                    day,
                    bookings: bookingData ? parseInt(bookingData.dataValues.count, 10) : 0,
               }
          })

          return res.status(200).json({
               statusCode: 200,
               success: true,
               message: 'Success',
               data: formattedData,
          })
     } catch (error) {
          console.error('Error fetching weekly bookings:', error)
          return res.status(500).json({
               statusCode: 500,
               success: false,
               message: 'Internal server error',
               error,
          })
     }
}
