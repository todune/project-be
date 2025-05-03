import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Category from './category.model'

export interface ProductInstance extends Model {
     id: number
     name: string
     type: string
     description?: string
     price: number
     quantity: number
     image_url?: string
     created_at?: Date
     updated_at?: Date
     category_id: number
}

const Product = db.define<ProductInstance>(
     'Product',
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
          type: {
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
          quantity: {
               type: DataTypes.INTEGER,
               defaultValue: 0,
          },
          image_url: {
               type: DataTypes.STRING(255),
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

Product.belongsTo(Category, { as: 'catProductData', foreignKey: 'category_id', onDelete: 'CASCADE' })

export default Product
