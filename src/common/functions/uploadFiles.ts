import multer from 'multer'
import path from 'path'
import { Request } from 'express'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = (subfolder: string) =>
     multer.diskStorage({
          destination: (
               req: Request,
               file: Express.Multer.File,
               cb: DestinationCallback
          ) => {
               cb(null, `./uploads/${subfolder}`)
          },
          filename: (
               req: Request,
               file: Express.Multer.File,
               cb: FileNameCallback
          ) => {
               let fileName = Buffer.from(file.originalname, 'latin1').toString(
                    'utf8'
               )
               const now = Date.now()
               cb(
                    null,
                    //   `${file.fieldname}-${Date.now()}${path.extname(
                         //   file.originalname
                    //   )}`
                    `${now}${fileName}`
               )
          },
     })

const uploadFile = (subfolder: string) =>
     multer({
          storage: storage(subfolder),
          limits: { fileSize: 100 * 1024 * 1024 },
     })

export default uploadFile
