import { DataTypes, Model } from 'sequelize'
import db from '../db/db'

export interface UserInstance extends Model {
  user_id: string
}

const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullname: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    address: DataTypes.TEXT,
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.DATEONLY,
    avatar: DataTypes.STRING,
  },
  { timestamps: true }
)

export default User
