import { DataTypes, Model } from 'sequelize'
import Booking from './booking.model'
import db from '@configs/db.config'

export interface TransactionInstance extends Model {
     id: number
     booking_id: number
     amount: number
     status: 'success' | 'fail'
     response_time: Date
     signature: string
     pay_type: string
     trans_id: string
     result_code: number
     created_at: Date
     updated_at: Date
}

const Transaction = db.define<TransactionInstance>(
     'Transaction',
     {
          id: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement: true,
          },
          booking_id: {
               type: DataTypes.INTEGER,
               allowNull: false,
          },
          amount: {
               type: DataTypes.DECIMAL(10, 2),
               allowNull: false,
          },
          response_time: {
               type: DataTypes.DATE,
               allowNull: false,
          },
          signature: {
               type: DataTypes.STRING,
               allowNull: false,
          },
          result_code: {
               type: DataTypes.INTEGER,
               allowNull: false,
          },
          pay_type: {
               type: DataTypes.STRING,
               allowNull: false,
          },
          trans_id: {
               type: DataTypes.STRING,
               allowNull: false,
          },
          status: {
               type: DataTypes.ENUM('success', 'fail'),
               defaultValue: 'success',
          },
     },
     {
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
     }
)

Transaction.belongsTo(Booking, {
     as: 'bookingTransactionData',
     foreignKey: 'booking_id',
     onDelete: 'CASCADE',
})

export default Transaction
