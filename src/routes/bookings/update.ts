import { Request, Response } from 'express'
import logger from '../../common/logger'
import MessageError from '../../common/error/message.error'
import { Category } from '../../models'
import { Validator } from '../../common/functions/validator'

const messageError = new MessageError()

export const updateCategory = async (req: Request, res: Response) => {
     logger.init(req)

     const { categoryId } = req.params
     const { name, note, code } = req.body

     try {
          if (!categoryId) {
               return res.status(400).json({
                    success: false,
                    message: MessageError.MISSING_INPUT,
               })
          }

          if (name) {
               const existingCategoryName = await Category.findOne({
                    where: {
                         name,
                    },
               })

               if (existingCategoryName) {
                    return res.status(409).json({
                         success: false,
                         message: messageError.errorExist('Tên danh mục'),
                    })
               }}

          if (code) {
               const existingCategoryCode = await Category.findOne({
                    where: {
                         code,
                    },
               })

               if (existingCategoryCode) {
                    return res.status(409).json({
                         success: false,
                         message: messageError.errorExist('Mã danh mục'),
                    })
               }
          }

          let dataUpdate: any = {}
          if (name) dataUpdate.name = name
          if (code) dataUpdate.code = code
          dataUpdate.note = note === '' ? null : note

          await Category.update(dataUpdate, { where: { id: categoryId } })

          return res.status(200).json({
               success: true,
               message: messageError.successMessageUpdate('danh mục'),
          })
     } catch (error: any) {
          logger.error(
               '>> [categories/update.ts] update category device failed',
               error
          )
          return res.status(500).json({
               success: false,
               message: MessageError.SOMETHING_WENT_WRONG,
          })
     }
}
