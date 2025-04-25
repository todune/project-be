import { DataTypes, Model } from 'sequelize'
import db from '../db/db'
import User from './users'

export interface NotificationInstance extends Model {
    notification_id: string
}

const Notification = db.define(
    'Notification',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        message: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'unread',
        },
        sent_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    { timestamps: true }
)

User.hasMany(Notification, {
    foreignKey: 'user_id',
    as: 'userNotifications',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'userInfo',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

export default Notification
