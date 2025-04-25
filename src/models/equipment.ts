import { DataTypes, Model } from 'sequelize'
import db from '../db/db'

export interface EquipmentInstance extends Model {
  equipment_id: string
}

const Equipment = db.define(
  'Equipment',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    quantity_available: DataTypes.INTEGER,
    rental_price: DataTypes.INTEGER,
  },
  { timestamps: true }
)

export default Equipment
