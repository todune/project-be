import { DataTypes, Model } from 'sequelize'
import db from '../db/db'

export interface FoodBeverageInstance extends Model {
    item_id: string
}

const FoodBeverage = db.define(
    'FoodBeverage',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.INTEGER,
        },
        quantity_in_stock: {
            type: DataTypes.INTEGER,
        },
    },
    { timestamps: true }
)

export default FoodBeverage
