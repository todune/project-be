import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'

export interface SlotInstance extends Model {
     id: number
     start_time: string
     end_time: string
     name: string
}

const Slot = db.define<SlotInstance>(
     'Slot',
     {
          id: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement: true,
          },
          start_time: {
               type: DataTypes.TIME,
               allowNull: false,
          },
          end_time: {
               type: DataTypes.TIME,
               allowNull: false,
          },
          name: {
               type: DataTypes.STRING,
          },
     },
     {
          timestamps: false,
     }
)

export default Slot
