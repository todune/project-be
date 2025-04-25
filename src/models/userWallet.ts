import { DataTypes, Model } from 'sequelize'
import db from '../db/db'
import User from './users'

export interface UserWalletInstance extends Model {
  wallet_id: string
}

const UserWallet = db.define(
  'UserWallet',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { timestamps: true }
)

User.hasOne(UserWallet, {
  foreignKey: 'user_id',
  as: 'walletInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

UserWallet.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'userInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

export default UserWallet
