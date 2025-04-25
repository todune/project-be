export class Validator {
     static isValid(
          value: any,
          options: { allowEmptyString?: boolean } = {}
     ): boolean {
          const { allowEmptyString = false } = options

          if (
               !allowEmptyString &&
               (value === undefined ||
                    value === null ||
                    value === 'undefined' ||
                    value === 'null')
          ) {
               return false
          }

          if (
               !allowEmptyString &&
               typeof value === 'string' &&
               value.trim() === ''
          ) {
               return false
          }

          return true
     }

     static formatShowMsgInvalid(values: string[]): string {
          return values.map((value) => `${value}=${value}`).join(',')
     }
}
