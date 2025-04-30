const Msg = {
     username: 'username',
     email: 'email',
     password: 'password',
     code: 'code',
     note: 'note',
     create: 'create',
     update: 'update',
     delete: 'delete',
     file: 'file',
}

export type MsgKey = keyof typeof Msg

export class AppMsg {
     static readonly serverError = 'server_error'
     static readonly devError = 'dev_error'
     static readonly forbidden = 'forbidden'
     static readonly unauthorized = 'un_authorized'
     static readonly validationFailure = 'validation_failure'
     static readonly databaseConnectionFailure = 'database_connection_failure'
     static readonly formulaIncorrect = 'formula_incorrect'
     static readonly formulaNotSplit = 'formula_not_split'
     static readonly sessionExpired = 'session_expired'
     static readonly accessTokenRequire = 'access_token.require'
     static readonly refreshTokenRequire = 'refresh_token.require'
     static readonly accessTokenGenFailure = 'access_token_gen_failure'
     static readonly accessTokenInvalid = 'access_token_invalid'
     static readonly accessTokenExpired = 'access_token_expired'
     static readonly refreshTokenGenFailure = 'refresh_token_gen_failure'
     static readonly refreshTokenInvalidOrExpired = 'refresh_token_invalid_or_expired'
     static readonly refreshTokenInvalid = 'refresh_token_invalid'
     static readonly exceedMaxMaterialQty = 'exceed_max_material_qty'
     static readonly something = 'something'
     static readonly fileNotFound = 'file_not_found'
     static readonly errorReadFile = 'error_read_file'
     static require(key: MsgKey, index?: number | string) {
          return index || index === 0 ? `${key}.require.${index}` : `${key}.require`
     }

     static invalid(key: MsgKey) {
          return `${key}.invalid`
     }

     static duplicate(key: MsgKey, index?: number | string) {
          return index || index === 0 ? `${key}.duplicate.${index}` : `${key}.duplicate`
     }

     static notFound(key: MsgKey, index?: number | string) {
          return index || index === 0 ? `${key}.not_found.${index}` : `${key}.not_found`
     }

     static incorrect(key: MsgKey) {
          return `${key}.incorrect`
     }

     static notRegister(key: MsgKey) {
          return `${key}.not_register`
     }

     static notActive(key: MsgKey) {
          return `${key}.not_active`
     }

     static lock(key: MsgKey) {
          return `${key}.lock`
     }

     static success(key: MsgKey) {
          return `${key}.success`
     }

     static minLength(key: MsgKey, length: number = 6) {
          return `${key}.min_length.${length}`
     }

     static notGenerate(key: MsgKey) {
          return `${key}.not_generate`
     }

     static exceed(key: MsgKey, index?: number | string) {
          return index || index === 0 ? `${key}.exceed.${index}` : `${key}.exceed`
     }

     static mustBeNumber(key: MsgKey, index?: number | string) {
          return index || index === 0 ? `${key}.must_be_number.${index}` : `${key}.must_be_number`
     }

     static mustBeString(key: MsgKey, index?: number | string) {
          return index || index === 0 ? `${key}.must_be_string.${index}` : `${key}.must_be_string`
     }
}
