import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Role, { RoleInstance } from './role.model'

export interface UserInstance extends Model {
     id: number
     username: string
     password: string
     full_name: string
     email: string
     phone_number: string
     address?: string
     role_id: number
     roleData: RoleInstance
}

const User = db.define<UserInstance>(
     'User',
     {
          id: {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true,
          },
          username: {
               type: DataTypes.STRING(50),
          },
          password: {
               type: DataTypes.STRING(255),
          },
          full_name: {
               type: DataTypes.STRING(100),
          },
          email: {
               type: DataTypes.STRING(100),
          },
          phone_number: {
               type: DataTypes.STRING(15),
          },
          address: {
               type: DataTypes.STRING(255),
          },
          role_id: {
               type: DataTypes.INTEGER,
          },
     },
     {
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
     }
)

User.belongsTo(Role, { as: 'roleData', foreignKey: 'role_id', onDelete: 'CASCADE' })

export default User
