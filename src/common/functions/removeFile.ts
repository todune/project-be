import { Request } from 'express'
import path from 'path'
import fs from 'fs'
import logger from '../logger'

export const removeFile = (req: Request) => {
     if (req.files) {
          const files = req.files as Express.Multer.File[]
          files.forEach((file) => {
               const tempPath = path.join('./uploads/temp', file.filename)
               if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath) // Xóa file nếu có lỗi
               }
          })
     }
}

export const removeListFiles = async (fileKeys: string[]): Promise<void> => {
     await Promise.all(
          fileKeys.map(async (fileKey: string) => {
               let realFileKey: string = fileKey

               if (fileKey?.startsWith('http')) {
                    const fileKeyArr = fileKey.split('/')
                    realFileKey = fileKeyArr[fileKeyArr.length - 1]
               }

               const tempPath = path.join(
                    `./uploads/${
                         fileKey?.startsWith('http') ? 'files' : 'temp'
                    }`,
                    realFileKey
               )
               if (fs.existsSync(tempPath)) {
                    logger.info(
                         '>> [RUN] removeListFiles() >> remove file ' +
                              realFileKey
                    )
                    fs.unlinkSync(tempPath) // Xóa file nếu có lỗi
               }
          })
     )
}
