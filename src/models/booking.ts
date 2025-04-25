import { DataTypes, Model } from 'sequelize'
import db from '../db/db'
import User from './users'
import Field from './field'

export interface BookingInstance extends Model {
  booking_id: string
}

const Booking = db.define(
  'Booking',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: DataTypes.INTEGER,
    field_id: DataTypes.INTEGER,
    booking_code: { type: DataTypes.STRING, unique: true },
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    total_price: DataTypes.INTEGER,
    status: DataTypes.STRING,
    note: DataTypes.TEXT,
  },
  { timestamps: true }
)

User.hasMany(Booking, { foreignKey: 'user_id', as: 'userBookings' })
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'userInfo' })

Field.hasMany(Booking, { foreignKey: 'field_id', as: 'fieldBookings' })
Booking.belongsTo(Field, { foreignKey: 'field_id', as: 'fieldInfo' })

export default Booking
