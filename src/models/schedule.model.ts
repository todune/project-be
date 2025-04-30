import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Court from './court.model'

export interface ScheduleInstance extends Model {
     id: number
     name: Date
}

const Schedule = db.define<ScheduleInstance>(
     'Schedule',
     {
          id: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement: true,
          },
          name: {
               type: DataTypes.STRING,
          },
          court_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
          },
     },
     {
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
     }
)

Schedule.belongsTo(Court, {
     foreignKey: 'court_id',
     as: 'courtScheduleData',
     onDelete: 'CASCADE',
})

export default Schedule
