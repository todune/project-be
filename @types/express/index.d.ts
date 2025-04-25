import { RoleType } from "../../src/common/functions/checkToken"

declare global {
     namespace Express {
          interface Request {
               user?: {
                    userId: string,
                    name: string,
                    code: string
               }
               roles?: string[],
               role?: string,
               perms?: RoleType
          }
     }
}

export {}
