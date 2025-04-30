import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'

export interface CategoryInstance extends Model {
     id: number
     name: string
     type: string
     description?: string
}

const Category = db.define<CategoryInstance>(
     'Category',
     {
          id: {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true,
          },
          name: {
               type: DataTypes.STRING,
          },
          type: {
               type: DataTypes.STRING,
          },
          description: {
               type: DataTypes.TEXT,
          },
     },
     {
          timestamps: false,
     }
)

export default Category
