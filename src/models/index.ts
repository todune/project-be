import { readdirSync } from 'fs'
import { join, basename as _basename } from 'path'

// Lấy path hiện tại (nơi index.ts đang nằm)
const modelsPath = __dirname

// Đọc toàn bộ file model trong thư mục này
readdirSync(modelsPath)
     .filter((file) => {
          const ext = file.slice(file.lastIndexOf('.') + 1)
          return (
               file !== _basename(__filename) && // không lấy file index.ts
               (ext === 'ts' || ext === 'js') && // chỉ lấy ts/js file
               file.includes('.model.') // chỉ lấy file model
          )
     })
     .forEach((file) => {
          require(join(modelsPath, file)) // import từng model
     })
