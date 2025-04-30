import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Slot from './slot.model'
import Schedule from './schedule.model'

export interface CourtSlotInstance extends Model {
     id: number
     name: string
     court_id: number
     slot_id: number
     schedule_id: number
     weekday_price: number
     weekend_price: number
}

const CourtSlot = db.define<CourtSlotInstance>('CourtSlot', {
     id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
     },
     slot_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
     },
     weekday_price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
     },
     weekend_price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
     },
     schedule_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
     },
     is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
     },
})

CourtSlot.belongsTo(Schedule, {
     foreignKey: 'schedule_id',
     as: 'scheduleCourtSlotData',
     onDelete: 'CASCADE',
})
CourtSlot.belongsTo(Slot, { foreignKey: 'slot_id', as: 'slotData', onDelete: 'CASCADE' })

export default CourtSlot
