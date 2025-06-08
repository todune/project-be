import { DataTypes, Model } from 'sequelize'
import db from '@configs/db.config'
import Court from './court.model'

export interface TimeSlotInstance extends Model {
     id: number
     court_id: number
     date: Date
     start_time: string
     end_time: string
     price: string
     is_booked: boolean
     is_peak_hour: boolean
     lock_expires_at?: Date
     is_locked?: boolean
}

const TimeSlot = db.define<TimeSlotInstance>(
     'TimeSlot',
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
          date: {
               type: DataTypes.DATE,
               allowNull: false,
          },
          lock_expires_at: {
               type: DataTypes.DATE,
          },
          start_time: {
               type: DataTypes.TIME,
               allowNull: false,
          },
          end_time: {
               type: DataTypes.TIME,
               allowNull: false,
          },
          price: {
               type: DataTypes.DECIMAL(10, 2),
               allowNull: false,
          },
          is_booked: {
               type: DataTypes.BOOLEAN,
               defaultValue: false,
          },
          is_peak_hour: {
               type: DataTypes.BOOLEAN,
               defaultValue: false,
          },
          is_locked: {
               type: DataTypes.BOOLEAN,
               defaultValue: false,
          },
     },
     {
          timestamps: false,
     }
)

Court.hasMany(TimeSlot, { as: 'courtTimeSlots', foreignKey: 'court_id', onDelete: 'CASCADE' })
TimeSlot.belongsTo(Court, { as: 'timeSlotCourtData', foreignKey: 'court_id', onDelete: 'CASCADE' })

export default TimeSlot
