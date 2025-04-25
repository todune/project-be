import { DataTypes, Model } from 'sequelize'
import db from '../db/db'
import User from './users'
import Booking from './booking'

export interface FeedbackInstance extends Model {
    feedback_id: string
}

const Feedback = db.define(
    'Feedback',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        booking_id: {
            type: DataTypes.INTEGER,
        },
        rating: {
            type: DataTypes.INTEGER,
        },
        comment: {
            type: DataTypes.TEXT,
        },
        feedback_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    { timestamps: true }
)

User.hasMany(Feedback, {
    foreignKey: 'user_id',
    as: 'userFeedbacks',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Feedback.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'userInfo',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Booking.hasMany(Feedback, {
    foreignKey: 'booking_id',
    as: 'bookingFeedbacks',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Feedback.belongsTo(Booking, {
    foreignKey: 'booking_id',
    as: 'bookingInfo',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

export default Feedback
