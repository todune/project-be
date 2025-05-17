import { Request, Response } from 'express'
import Booking from '@models/booking.model'
import User from '@models/user.model'
import Court from '@models/court.model'
import TimeSlot from '@models/time-slot.model'
import { Op } from 'sequelize'
import moment from 'moment-timezone'

export const getUpcomingBookings = async (req: Request, res: Response) => {
     try {
          const now = new Date()

          // Find bookings scheduled for today or future dates
          const upcomingBookings = await Booking.findAll({
               attributes: ['id', 'status'],
               include: [
                    {
                         model: User,
                         as: 'userBookingData',
                         attributes: ['full_name'],
                    },
                    {
                         model: Court,
                         as: 'courtBookingData',
                         attributes: ['name'],
                    },
                    {
                         model: TimeSlot,
                         as: 'timeSlotBookingData',
                         attributes: ['date', 'start_time', 'end_time'],
                         where: {
                              date: {
                                   [Op.gte]: moment().startOf('day').toDate(),
                              },
                         },
                    },
               ],
               order: [
                    [{ model: TimeSlot, as: 'timeSlotBookingData' }, 'date', 'ASC'],
                    [{ model: TimeSlot, as: 'timeSlotBookingData' }, 'start_time', 'ASC'],
               ],
               limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 4,
          })

          // Format the data for the frontend
          const formattedBookings = upcomingBookings.map((booking) => {
               const bookingDate = moment(
                    booking.dataValues.timeSlotBookingData.dataValues.date
               ).format('DD/MM/YYYY')
               return {
                    id: booking.dataValues.id,
                    customerName: booking.dataValues.userBookingData.dataValues.full_name,
                    court: booking.dataValues.courtBookingData.dataValues.name,
                    date: bookingDate,
                    time: `${booking.dataValues.timeSlotBookingData.dataValues.start_time} - ${booking.dataValues.timeSlotBookingData.dataValues.end_time}`,
                    status:
                         booking.dataValues.status === 'Đã thanh toán'
                              ? 'Đã xác nhận'
                              : 'Chờ thanh toán',
               }
          })

          return res.status(200).json({
               statusCode: 200,
               success: true,
               message: 'Success',
               data: formattedBookings,
          })
     } catch (error) {
          console.error('Error fetching upcoming bookings:', error)
          return res.status(500).json({
               statusCode: 500,
               success: false,
               message: 'Internal server error',
               error,
          })
     }
}
