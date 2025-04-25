import fs from 'fs'
import path from 'path'
import logger from '../logger'

export const createFolderSync = (subFolders: string[]) => {
     const uploadsDir = path.join(__dirname, '../../../uploads')

     if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
     }

     const folderQr = ['devices', 'employees', 'orders', 'customers']
     subFolders.forEach((folder: string) => {
          const folderPath = path.join(uploadsDir, folder)
          if (!fs.existsSync(folderPath)) {
               fs.mkdirSync(folderPath)
               logger.info('>> Init folder >> folder ' + folder + ' created')
          }

          if (folder === 'QRs') {
               const qrsFolderPath = path.join(uploadsDir, 'QRs')
               if (!fs.existsSync(qrsFolderPath)) {
                    fs.mkdirSync(qrsFolderPath)
                    logger.info('>> Init folder >> QRs folder created')
               }

               folderQr.forEach((sub: string) => {
                    const subFolderPath = path.join(qrsFolderPath, sub)
                    if (!fs.existsSync(subFolderPath)) {
                         fs.mkdirSync(subFolderPath)
                         logger.info(
                              '>> Init folder >> subfolder ' + sub + ' created'
                         )
                    }
               })
          }
     })
}
