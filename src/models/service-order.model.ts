import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Booking from './booking.model'
import FoodItem from './food.model'
import EquipmentItem from './equipment.model'

export interface ServiceOrderInstance extends Model {
     id: number
     booking_id: number
     equipment_item_id: number
     food_item_id: number
     quantity: number
     price: number
}

const ServiceOrder = db.define<ServiceOrderInstance>(
     'ServiceOrder',
     {
          id: {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true,
          },
          booking_id: {
               type: DataTypes.INTEGER,
          },
          food_item_id: {
               type: DataTypes.INTEGER,
          },
          equipment_item_id: {
               type: DataTypes.INTEGER,
          },
          quantity: {
               type: DataTypes.INTEGER,
          },
          price: {
               type: DataTypes.DECIMAL(10, 2),
          },
     },
     {
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
     }
)

ServiceOrder.belongsTo(Booking, {
     as: 'bookingOrderData',
     foreignKey: 'booking_id',
     onDelete: 'CASCADE',
})

ServiceOrder.belongsTo(FoodItem, {
     as: 'foodOrderData',
     foreignKey: 'food_item_id',
     onDelete: 'CASCADE',
     constraints: false,
})

ServiceOrder.belongsTo(EquipmentItem, {
     as: 'equipmentOrderData',
     foreignKey: 'equipment_item_id',
     onDelete: 'CASCADE',
     constraints: false,
})

export default ServiceOrder
