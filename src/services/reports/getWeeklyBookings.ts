import { Request, Response } from 'express'
import Booking from '@models/booking.model'
import { Sequelize, Op } from 'sequelize'
import moment from 'moment-timezone'

export const getWeeklyBookings = async (req: Request, res: Response) => {
     try {
          // Cách tính đúng: lấy ngày hiện tại, sau đó tính ngày đầu tuần và cuối tuần
          const now = moment()

          // Tìm thứ 2 của tuần hiện tại (0 = CN, 1 = T2, ...)
          const currentDayOfWeek = now.day()

          // Nếu hôm nay là chủ nhật (0), lùi lại 6 ngày để lấy thứ 2 tuần này
          // Nếu không phải chủ nhật, lùi lại (currentDayOfWeek - 1) ngày để lấy thứ 2
          const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1

          const startOfWeek = moment().subtract(daysToSubtract, 'days').startOf('day').toDate()
          const endOfWeek = moment(startOfWeek).add(6, 'days').endOf('day').toDate()

          // Query booking counts for each day of the week
          const bookingsByDay = await Booking.findAll({
               attributes: [
                    [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
               ],
               where: {
                    created_at: {
                         [Op.between]: [startOfWeek, endOfWeek],
                    },
                    status: {
                         [Op.in]: ['Đã thanh toán', 'Chờ thanh toán', 'Mới'],
                    },
               },
               group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
               order: [Sequelize.literal('date ASC')],
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
