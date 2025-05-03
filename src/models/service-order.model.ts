import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Booking from './booking.model'
import Product from './product.model'

export interface ServiceOrderInstance extends Model {
     id: number
     booking_id: number
     product_id: number
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
          product_id: {
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

Booking.hasMany(ServiceOrder, {
     as: 'serviceOrderData',
     foreignKey: 'booking_id',
     onDelete: 'CASCADE',
})
ServiceOrder.belongsTo(Booking, {
     as: 'bookingOrderData',
     foreignKey: 'booking_id',
     onDelete: 'CASCADE',
})
ServiceOrder.belongsTo(Product, {
     as: 'productData',
     foreignKey: 'product_id',
     onDelete: 'CASCADE',
})

export default ServiceOrder
