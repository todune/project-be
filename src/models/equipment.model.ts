import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Category from './category.model'

export interface EquipmentItemInstance extends Model {
     id: number
     name: string
     description?: string
     price: number
     quantity: number
     image_url?: string
     created_at?: Date
     updated_at?: Date
     category_id: number
}

const EquipmentItem = db.define<EquipmentItemInstance>(
     'EquipmentItem',
     {
          id: {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true,
          },
          name: {
               type: DataTypes.STRING(100),
               allowNull: false,
          },
          description: {
               type: DataTypes.STRING(255),
          },
          price: {
               type: DataTypes.DECIMAL(10, 2),
               allowNull: false,
          },
          image_url: {
               type: DataTypes.STRING(255),
          },
          quantity: {
               type: DataTypes.INTEGER,
               defaultValue: 0,
          },
          category_id: {
               type: DataTypes.INTEGER,
          },
     },
     {
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
     }
)

EquipmentItem.belongsTo(Category, {
     as: 'catEquipmentData',
     foreignKey: 'category_id',
     onDelete: 'CASCADE',
})

export default EquipmentItem
