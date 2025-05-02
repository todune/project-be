import { ApiError } from '@common/errors/apiError'
import { AppMsg } from '@common/utils/appMsg'
import db from './db.config'
import Role from '@models/role.model'
import User from '@models/user.model'
import { hashPw } from '@common/utils/hashPw'
import Category from '@models/category.model'
import FoodItem from '@models/food.model'
import EquipmentItem from '@models/equipment.model'
import Slot from '@models/time-slot.model'
import Court from '@models/court.model'

export async function seeder() {
     await db.sync({ force: true })
     const transaction = await db.transaction()

     try {
          // 1. role
          await Role.bulkCreate([{ name: 'admin' }, { name: 'staff' }, { name: 'user' }], {
               transaction,
          })

          // 2 . user
          await User.bulkCreate(
               [
                    {
                         username: 'admin',
                         password: await hashPw('123456'),
                         full_name: 'Admin',
                         email: 'admin@gmail.com',
                         phone_number: '0935432321',
                         role_id: 1,
                    },
                    {
                         username: 'staff1',
                         password: await hashPw('123456'),
                         full_name: 'Nguyễn Văn Hoàng',
                         email: 'staff1@gmail.com',
                         phone_number: '0935432321',
                         role_id: 2,
                    },
                    {
                         username: 'user1',
                         password: await hashPw('123456'),
                         full_name: 'Lê Hoàng Long',
                         email: 'user1@gmail.com',
                         phone_number: '0935432321',
                         role_id: 3,
                    },
               ],
               { transaction }
          )

          // 3. category
          await Category.bulkCreate(
               [
                    { name: 'Sân bóng đá mini', type: 'sport' },
                    { name: 'Sân bóng đá 11 người', type: 'sport' },
                    { name: 'Sân tennis', type: 'sport' },
                    { name: 'Sân cầu lông', type: 'sport' },
                    { name: 'Sân bóng rổ', type: 'sport' },
                    { name: 'Sân bóng chuyền', type: 'sport' },
                    { name: 'Sân futsal', type: 'sport' },
                    { name: 'Sân golf', type: 'sport' },
                    { name: 'Sân bóng bàn', type: 'sport' },
                    { name: 'Sân bơi lội', type: 'sport' },
                    { name: 'Đồ uống', type: 'drink' },
                    { name: 'Đồ ăn nhanh', type: 'fast_food' },
                    { name: 'Thiết bị thể thao', type: 'equipment' },
               ],
               { transaction }
          )

          // 4. food item
          const foodCategory = await Category.findOne({
               where: { name: 'Đồ ăn nhanh' },
               transaction,
          })
          const drinkCategory = await Category.findOne({ where: { name: 'Đồ uống' }, transaction })

          if (!foodCategory || !drinkCategory)
               throw new Error('Chưa có danh mục phù hợp để seed món ăn')

          await FoodItem.bulkCreate(
               [
                    {
                         name: 'Hamburger',
                         description: 'Bánh mì kẹp thịt bò thơm ngon',
                         price: 50000,
                         quantity: 100,
                         image_url: '/images/hamburger.png',
                         category_id: foodCategory.id,
                    },
                    {
                         name: 'Pizza Pepperoni',
                         description: 'Pizza với xúc xích cay đặc trưng',
                         price: 120000,
                         quantity: 50,
                         image_url: '/images/pizza.png',
                         category_id: foodCategory.id,
                    },
                    {
                         name: 'Coca Cola',
                         description: 'Thức uống giải khát',
                         price: 15000,
                         quantity: 200,
                         image_url: '/images/coca.png',
                         category_id: drinkCategory.id,
                    },
                    {
                         name: 'Nước suối',
                         description: 'Nước khoáng thiên nhiên',
                         price: 10000,
                         quantity: 300,
                         image_url: '/images/water.png',
                         category_id: drinkCategory.id,
                    },
               ],
               { transaction }
          )

          // 5. equipment
          const equipmentCategory = await Category.findOne({
               where: { name: 'Thiết bị thể thao' },
               transaction,
          })

          if (!equipmentCategory)
               throw new Error('Chưa có danh mục "Thiết bị thể thao" để seed thiết bị')

          await EquipmentItem.bulkCreate(
               [
                    {
                         name: 'Vợt cầu lông',
                         description: 'Vợt cầu lông siêu nhẹ',
                         price: 150000,
                         quantity: 50,
                         image_url: '/images/votcaulong.png',
                         category_id: equipmentCategory.id,
                    },
                    {
                         name: 'Bóng rổ',
                         description: 'Bóng rổ tiêu chuẩn thi đấu',
                         price: 200000,
                         quantity: 30,
                         image_url: '/images/bongro.png',
                         category_id: equipmentCategory.id,
                    },
                    {
                         name: 'Giày đá bóng',
                         description: 'Giày sân cỏ nhân tạo',
                         price: 350000,
                         quantity: 40,
                         image_url: '/images/giaydabong.png',
                         category_id: equipmentCategory.id,
                    },
                    {
                         name: 'Hộp cầu lông Thành Công',
                         description: 'Hộp cầu lông 20 quả 1 hộp',
                         price: 28000,
                         quantity: 400,
                         image_url: '/images/giaydabong.png',
                         category_id: equipmentCategory.id,
                    },
               ],
               { transaction }
          )

          // 6. slot
          // await Slot.bulkCreate(
          //      [
          //           // Ca sáng
          //           { name: 'Ca sáng 1', start_time: '06:00:00', end_time: '09:00:00' },
          //           { name: 'Ca sáng 2', start_time: '09:00:00', end_time: '12:00:00' },
          //           { name: 'Ca sáng 3', start_time: '12:00:00', end_time: '15:00:00' },

          //           // Ca trưa
          //           { name: 'Ca trưa 1', start_time: '15:00:00', end_time: '18:00:00' },
          //           { name: 'Ca trưa 2', start_time: '18:00:00', end_time: '21:00:00' },
          //           { name: 'Ca trưa 3', start_time: '21:00:00', end_time: '00:00:00' },

          //           // Ca chiều
          //           { name: 'Ca chiều 1', start_time: '00:00:00', end_time: '03:00:00' },
          //           { name: 'Ca chiều 2', start_time: '03:00:00', end_time: '06:00:00' },
          //           { name: 'Ca chiều 3', start_time: '06:00:00', end_time: '09:00:00' },

          //           // Ca tối
          //           { name: 'Ca tối 1', start_time: '09:00:00', end_time: '12:00:00' },
          //           { name: 'Ca tối 2', start_time: '12:00:00', end_time: '15:00:00' },
          //           { name: 'Ca tối 3', start_time: '15:00:00', end_time: '18:00:00' },

          //           // Ca đêm
          //           { name: 'Ca đêm 1', start_time: '18:00:00', end_time: '21:00:00' },
          //           { name: 'Ca đêm 2', start_time: '21:00:00', end_time: '00:00:00' },
          //           { name: 'Ca đêm 3', start_time: '00:00:00', end_time: '03:00:00' },
          //      ],
          //      { transaction }
          // )

          // 7. court
          const categories = await Category.findAll({ where: { type: 'sport' }, transaction })

          for (const category of categories) {
               const courtsData = []
               for (let i = 1; i <= 4; i++) {
                    courtsData.push({
                         name: `${category.name} Sân ${i}`,
                         code: `CODE_${category.type}_${i}`,
                         location: `Vị trí ${category.type} ${i}`,
                         category_id: category.id,
                    })
               }

               await Court.bulkCreate(courtsData, { transaction })
          }

          // 8. court slot

          await transaction.commit()
     } catch (error) {
          await transaction.rollback()
          console.log('error seeder: ', error)
          throw new ApiError(AppMsg.something, 500)
     }
}
