import { DataTypes, Model } from 'sequelize'
import db from '../db/db'

export interface FieldInstance extends Model {
  field_id: string
}

const Field = db.define(
  'Field',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    price_hour: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
  },
  { timestamps: true }
)

export default Field
