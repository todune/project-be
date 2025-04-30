import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Court from './court.model'
import User from './user.model'
import CourtSlot from './court-slot.model'

export interface BookingInstance extends Model {
     id: number
     court_id: number
     user_id: number
     court_slot_id: number
     booking_date: Date
     price_at_booking: number
     total_price: number
     status: 'pending' | 'paid' | 'cancelled' | 'completed' | 'refunded'
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
          court_slot_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
          },
          booking_date: {
               type: DataTypes.DATE,
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
               type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'completed', 'refunded'),
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
Booking.belongsTo(CourtSlot, {
     as: 'courtSlotBookingData',
     foreignKey: 'court_slot_id',
     onDelete: 'CASCADE',
})

export default Booking
