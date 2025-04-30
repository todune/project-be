import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'

export interface RoleInstance extends Model {
     id: number
     name: string // 'admin' | 'user' | 'staff'
}

const Role = db.define<RoleInstance>(
     'Role',
     {
          id: {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true,
          },
          name: {
               type: DataTypes.STRING(50),
          },
     },
     {
          timestamps: false,
     }
)

export default Role
