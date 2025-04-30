import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Category from './category.model'

export interface CourtInstance extends Model {
     id: number
     name: string
     code: string
     location: string
     category_id: number
}

const Court = db.define<CourtInstance>('Court', {
     id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
     },
     name: {
          type: DataTypes.STRING,
     },
     code: {
          type: DataTypes.STRING,
     },
     location: {
          type: DataTypes.STRING,
     },
     category_id: {
          type: DataTypes.INTEGER,
     },
})

Court.belongsTo(Category, { foreignKey: 'category_id', as: 'catCourtData', onDelete: 'CASCADE' })

export default Court
