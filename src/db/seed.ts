import { Field,FoodBeverage,AdditionalService, Booking, Equipment, Feedback, Notification, User, UserWallet, WalletTransaction } from "../models"
import db from "./db"

const seedDatabase = async () => {
    await db.sync({ force: true })

    // Users
    const users = await User.bulkCreate([
        { fullname: "Nguyễn Văn An", email: "an@gmail.com", phone: "0905123456", password: "hashed_pwd", role: "admin", gender: "male" },
        { fullname: "Phạm Thị Linh", email: "linh@gmail.com", phone: "0905123457", password: "hashed_pwd", role: "user", gender: "female" },
        { fullname: "Hoàng Văn Nam", email: "nam@gmail.com", phone: "0905123458", password: "hashed_pwd", role: "staff", gender: "male" },
    ])

    console.log("users", users[0])

    // User Wallets
    const wallets = await UserWallet.bulkCreate([
        { user_id: users[0].dataValues.id, balance: 5000000 },
        { user_id: users[1].dataValues.id, balance: 3000000 },
        { user_id: users[2].dataValues.id, balance: 2000000 },
    ])

    // Wallet Transactions
    await WalletTransaction.bulkCreate([
        { wallet_id: wallets[0].dataValues.id, momo_trans_id: "MM123456789", transaction_type: "nạp tiền", amount: 5000000, status: "success" },
        { wallet_id: wallets[1].dataValues.id, momo_trans_id: "MM987654321", transaction_type: "nạp tiền", amount: 3000000, status: "success" },
        { wallet_id: wallets[2].dataValues.id, momo_trans_id: "MM456123789", transaction_type: "nạp tiền", amount: 2000000, status: "success" },
    ])

    // Fields
    const fields = await Field.bulkCreate([
        { name: "Sân bóng đá 1", type: "Bóng đá", price_hour: 300000, status: true, location: "Khu A", capacity: 22 },
        { name: "Sân tennis 1", type: "Tennis", price_hour: 200000, status: true, location: "Khu B", capacity: 4 },
    ])

    // Equipments
    const equipments = await Equipment.bulkCreate([
        { name: "Vợt tennis", quantity_available: 20, rental_price: 50000 },
        { name: "Giày đá bóng", quantity_available: 30, rental_price: 30000 },
    ])

    // Food & Beverages
    const foods = await FoodBeverage.bulkCreate([
        { name: "Nước suối Lavie", price: 10000, quantity_in_stock: 100 },
        { name: "Bánh mì Sandwich", price: 20000, quantity_in_stock: 50 },
    ])

    // Bookings
    const bookings = await Booking.bulkCreate([
        {
            user_id: users[1].dataValues.id,
            field_id: fields[0].dataValues.id,
            booking_code: "BK001",
            start_time: new Date('2025-05-01T08:00:00'),
            end_time: new Date('2025-05-01T10:00:00'),
            total_price: 600000,
            status: "confirmed",
        },
        {
            user_id: users[2].dataValues.id,
            field_id: fields[1].dataValues.id,
            booking_code: "BK002",
            start_time: new Date('2025-05-02T09:00:00'),
            end_time: new Date('2025-05-02T11:00:00'),
            total_price: 400000,
            status: "confirmed",
        },
    ])

    // Additional Services
    await AdditionalService.bulkCreate([
        {
            booking_id: bookings[0].dataValues.id,
            service_type: "equipments",
            equipment_id: equipments[1].dataValues.id,
            quantity: 2,
            total_price: 60000,
        },
        {
            booking_id: bookings[1].dataValues.id,
            service_type: "foods",
            item_id: foods[0].dataValues.id,
            quantity: 3,
            total_price: 30000,
        },
    ])

    // Feedbacks
    await Feedback.bulkCreate([
        {
            user_id: users[1].dataValues.id,
            booking_id: bookings[0].dataValues.id,
            rating: 5,
            comment: "Dịch vụ tốt, sân đẹp!",
        },
        {
            user_id: users[2].dataValues.id,
            booking_id: bookings[1].dataValues.id,
            rating: 4,
            comment: "Nhân viên nhiệt tình, sẽ quay lại!",
        },
    ])

    // Notifications
    await Notification.bulkCreate([
        {
            user_id: users[1].dataValues.id,
            message: "Đặt sân thành công, mã đặt sân BK001",
        },
        {
            user_id: users[2].dataValues.id,
            message: "Bạn có lịch đặt sân mới mã BK002",
        },
    ])

    console.log('✅ Seed dữ liệu đầy đủ hoàn tất!')
}

// seedDatabase().catch(error => {
//     console.error('❌ Lỗi seed dữ liệu:', error)
// })

export default seedDatabase
