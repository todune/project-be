import { DataTypes, Model } from 'sequelize'
import db from '../db/db'
import UserWallet from './userWallet'

export interface WalletTransactionInstance extends Model {
  transaction_id: string
}

const WalletTransaction = db.define(
  'WalletTransaction',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    wallet_id: DataTypes.INTEGER,
    momo_trans_id: DataTypes.STRING,
    transaction_type: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
  },
  { timestamps: true }
)

UserWallet.hasMany(WalletTransaction, {
  foreignKey: 'wallet_id',
  as: 'walletTransactions',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

WalletTransaction.belongsTo(UserWallet, {
  foreignKey: 'wallet_id',
  as: 'walletInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

export default WalletTransaction
