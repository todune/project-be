import { classifyFile } from './classifyFile'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import 'dotenv'
import { FileData, UploadedFile } from '../interface'

const moveFile = promisify(fs.rename)

// interface UploadedFile {
//      filename: string
// }

// export interface File {
//      key: string
//      type: string
//      value: string
// }

export const processSingleFile = async (file: UploadedFile): Promise<FileData> => {
     let type = classifyFile(file)

     const tempPath = path.join('./uploads/temp', file.filename)
     const targetPath = path.join('./uploads/files', file.filename)

     await moveFile(tempPath, targetPath)

     const imageUrl = process.env.HOST + `/uploads/files/${file.filename}`

     return {
          key: file.filename,
          type,
          name: file.filename.slice(13),
          value: imageUrl,
          linkDb: `/uploads/files/${file.filename}`
     }
}
