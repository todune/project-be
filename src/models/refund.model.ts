import db from '@configs/db.config'
import { DataTypes, Model } from 'sequelize'
import Booking from './booking.model' // Import model Booking
import User from './user.model' // Import model User (người xử lý hoàn tiền)

export interface RefundInstance extends Model {
     id: number
     booking_id: number // Hoàn tiền cho booking nào
     amount: number // Số tiền hoàn lại
     refund_date: Date // Thời điểm hoàn tiền
     method: string | null // Phương thức hoàn tiền (ví dụ: "Chuyển khoản ngân hàng", "Tiền mặt")
     notes: string | null // Ghi chú/lý do hoàn tiền
     processed_by_user_id: number | null // ID của nhân viên/admin xử lý hoàn tiền
     created_at: Date
     updated_at: Date
}

const Refund = db.define<RefundInstance>(
     'Refund',
     {
          id: {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement: true,
          },
          booking_id: {
               type: DataTypes.INTEGER,
               allowNull: false, // references: { //   model: Booking, // Link to Booking model //   key: 'id', // },
          },
          amount: {
               type: DataTypes.DECIMAL(10, 2),
               allowNull: false,
          },
          refund_date: {
               type: DataTypes.DATE,
               allowNull: false,
               defaultValue: DataTypes.NOW,
          },
          method: {
               type: DataTypes.STRING(50),
               allowNull: true,
          },
          notes: {
               type: DataTypes.STRING(500),
               allowNull: true,
          },
          processed_by_user_id: {
               type: DataTypes.INTEGER,
               allowNull: true, // Có thể null nếu hoàn tiền tự động (ít xảy ra với quy trình thủ công) // references: { //   model: User, // Link to User model //   key: 'id', // },
          },
     },
     {
          timestamps: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
     }
)

// Định nghĩa mối quan hệ
Refund.belongsTo(Booking, {
     as: 'bookingRefundData',
     foreignKey: 'booking_id',
     onDelete: 'CASCADE',
})
Refund.belongsTo(User, {
     as: 'processorUserData',
     foreignKey: 'processed_by_user_id',
     onDelete: 'SET NULL',
})

export default Refund
