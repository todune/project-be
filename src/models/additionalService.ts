import { DataTypes, Model } from 'sequelize'
import db from '../db/db'
import Booking from './booking'
import Equipment from './equipment'
import FoodBeverage from './foodBeverage'

export interface AdditionalServiceInstance extends Model {
  service_id: string
}

const AdditionalService = db.define(
  'AdditionalService',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    booking_id: DataTypes.INTEGER,
    service_type: DataTypes.STRING,
    equipment_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
  },
  { timestamps: true }
)

Booking.hasMany(AdditionalService, { foreignKey: 'booking_id', as: 'bookingServices' })
AdditionalService.belongsTo(Booking, { foreignKey: 'booking_id', as: 'bookingInfo' })

Equipment.hasMany(AdditionalService, { foreignKey: 'equipment_id', as: 'equipmentServices' })
AdditionalService.belongsTo(Equipment, { foreignKey: 'equipment_id', as: 'equipmentInfo' })

FoodBeverage.hasMany(AdditionalService, { foreignKey: 'item_id', as: 'foodBeverageServices' })
AdditionalService.belongsTo(FoodBeverage, { foreignKey: 'item_id', as: 'foodBeverageInfo' })

export default AdditionalService
