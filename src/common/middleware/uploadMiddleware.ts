import { Request, Response, NextFunction } from 'express'
import { ErrorCode, UploadType } from '@common/interface'
import { ApiError } from '@common/errors/apiError'
import logger from '@common/logger'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { AppMsg } from '@common/utils/appMsg'

export const uploadFileMiddleware = (type: UploadType) => {
     return (req: Request, res: Response, next: NextFunction) => {
          let folderPath: string

          if (type === UploadType.IMAGE) {
               folderPath = path.join(__dirname, '../../../uploads/images')
          } else if (type === UploadType.FILE) {
               folderPath = path.join(__dirname, '../../../uploads/files')
          } else {
               return next(new ApiError(AppMsg.invalid('file'), ErrorCode.BAD_REQUEST))
          }

          if (!fs.existsSync(folderPath)) {
               fs.mkdirSync(folderPath, { recursive: true })
          }

          const storage = multer.diskStorage({
               destination: (req, file, cb) => {
                    cb(null, folderPath)
               },
               filename: (req, file, cb) => {
                    // const uniqueSuffix = `${Date.now()}-${Math.round(
                    //      Math.random() * 1e9
                    // )}${path.extname(file.originalname)}`
                    let fileName = Buffer.from(file.originalname, 'latin1').toString('utf8')
                    const now = Date.now()
                    cb(null, `${now}${fileName}`)
               },
          })

          const upload = multer({ storage }).any()

          upload(req, res, async (err) => {
               if (err) {
                    logger.error('Upload Error:', err)
                    return next(new ApiError('Upload failed', ErrorCode.INTERNAL_ERROR))
               }

               const files = req.files as Express.Multer.File[]
               let keys = req.body.keys

               if (!Array.isArray(keys)) {
                    keys = keys ? [keys] : []
               }

               if (files.length !== keys.length) {
                    return next(
                         new ApiError(
                              'Số lượng file không khớp với số keys!',
                              ErrorCode.BAD_REQUEST
                         )
                    )
               }

               try {
                    let uploadedUrls: Record<string, string> = {}

                    files.forEach((file, index) => {
                         const fileUrl = `/uploads/files/${file.filename}`
                         uploadedUrls[keys[index]] = fileUrl
                    })

                    res.status(200).json(uploadedUrls)
               } catch (error) {
                    logger.error('Lỗi trong quá trình xử lý upload:', error)
                    return next(new ApiError('Upload failed', ErrorCode.INTERNAL_ERROR))
               }
          })
     }
}
