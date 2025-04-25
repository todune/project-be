import { Request, Response } from 'express'
import logger from '../../common/logger'
import User from '../../models/users'
import MessageError from '../../common/error/message.error'
import { Validator } from '../../common/functions/validator'
import { removeListFiles } from '../../common/functions/removeFile'

import { FileData } from '../../common/interface'
import db from '../../db/db'
import { processSingleFile } from '../../common/functions/processSingleFile'
const messageError = new MessageError()


export const updateMe = async (req: Request, res: Response) => {
    logger.init(req)

    let avatarImage: FileData | undefined
    const transaction = await db.transaction()


    try {

        if (req.file) {
            avatarImage = await processSingleFile(req.file)
        }
        const userId = req.user?.userId
        const {
            divisionId,
            departmentId,
            roleId,
            name,
            code,
            phoneNumber,
            note,
            email,
        } = req.body

        if (
            !Validator.isValid(divisionId) ||
            !Validator.isValid(roleId) ||
            !Validator.isValid(name) ||
            !Validator.isValid(code) ||
            !Validator.isValid(phoneNumber) ||
            !Validator.isValid(email)
        ) {
            return res.status(400).json({
                success: false,
                message: MessageError.MISSING_INPUT,
            })
        }
         
        let dataToUpdate: any = {
            divisionId,
            departmentId: departmentId || null,
            roleId,
            name,
            code,
            phoneNumber,
            note: note || null,
            email,
            avatar: avatarImage?.value ? avatarImage.value : null,
        }

        await User.update(dataToUpdate, { where: { id: userId }, transaction })

        await transaction.commit()
        
        return res.status(200).json({
            success: true,
            message: messageError.successMessageUpdate('thông tin cá nhân'),
        })


    } catch (error: any) {
        await transaction.rollback();
        let dataNeedRemoved = [];
        if (avatarImage) dataNeedRemoved.push(avatarImage.key);
        if (avatarImage) {
            await removeListFiles(dataNeedRemoved);
        }
    
        if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
            if (error.errors[0]?.message === 'code must be unique') {
                return res.status(422).json({
                    success: false,
                    message: messageError.errorExist('Mã nhân sự'),
                });
            }
    
            if (error.errors[0]?.message === 'email must be unique') {
                return res.status(422).json({
                    success: false,
                    message: messageError.errorExist('Email'),
                });
            }
        }
    
        logger.error('>> [users/update.ts] update user failed: ' + error);
        return res.status(500).json({
            success: false,
            message: MessageError.SOMETHING_WENT_WRONG,
        });
    }
    
}
