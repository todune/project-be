import { DataTypes, Model } from 'sequelize'
import db from '@configs/db.config'

export interface PermissionInstance extends Model {
     id: number
     name: string
}

const Permission = db.define<PermissionInstance>(
     'Permission',
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
     },
     {
          timestamps: false,
     }
)

export default Permission
