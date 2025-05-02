import { DataTypes, Model } from 'sequelize'
import TimeSlot from './time-slot.model'
import db from '@configs/db.config'
import Court from './court.model'
import User from './user.model'

export interface BookingInstance extends Model {
     id: number
     court_id: number
     time_slot_id: number
     user_id: number
     price_at_booking: string
     total_price: string
     status: 'pending' | 'paid' | 'wait_payment' | 'refunded' | 'cancelled'
     created_at: Date
     updated_at: Date
     notes: string | null
}

const Booking = db.define<BookingInstance>(
     'Booking',
     {
          id: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement: true,
          },
          court_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
          },
          user_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
          },
          time_slot_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
          },
          price_at_booking: {
               type: DataTypes.DECIMAL(10, 2),
               allowNull: false,
          },
          total_price: {
               type: DataTypes.DECIMAL(10, 2),
               allowNull: false,
          },
          status: {
               type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'wait_payment', 'refunded'),
               defaultValue: 'pending',
          },
          notes: {
               type: DataTypes.STRING(500),
               allowNull: true,
          },
     },
     {
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
     }
)

Booking.belongsTo(Court, { as: 'courtBookingData', foreignKey: 'court_id', onDelete: 'CASCADE' })
Booking.belongsTo(User, { as: 'userBookingData', foreignKey: 'user_id', onDelete: 'CASCADE' })
TimeSlot.hasOne(Booking, {
     as: 'bookingData',
     foreignKey: 'time_slot_id',
     onDelete: 'CASCADE',
})
Booking.belongsTo(TimeSlot, {
     as: 'timeSlotBookingData',
     foreignKey: 'time_slot_id',
     onDelete: 'CASCADE',
})

export default Booking
