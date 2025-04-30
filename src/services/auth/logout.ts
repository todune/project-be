import { clearAuthCookies } from '@common/utils/tokenUtils'
import { sendJson } from '@common/utils/sendJson'
import { Request, Response } from 'express'

export const logout = async (req: Request, res: Response) => {
     clearAuthCookies(res)
     sendJson(res, null, 'Đăng xuất thành công')
}
