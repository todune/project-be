import { DataTypes, Model } from 'sequelize'
import db from '@configs/db.config'

export interface SportCenterInstance extends Model {
     id: number
     name: string
     address: string
     image_url: string
     description?: string
     location: string
}

const SportCenter = db.define<SportCenterInstance>(
     'SportCenter',
     {
          id: {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true,
          },
          name: {
               type: DataTypes.STRING,
          },
          address: {
               type: DataTypes.STRING,
          },
          image_url: {
               type: DataTypes.STRING,
          },
          description: {
               type: DataTypes.TEXT,
          },
          location: {
               type: DataTypes.STRING,
          },
     },
     {
          timestamps: false,
     }
)

export default SportCenter
