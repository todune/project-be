export const generatePassword = (length = 6): string => {
     const characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?'
     let password = ''
     for (let i = 0; i < length; i++) {
          password += characters.charAt(
               Math.floor(Math.random() * characters.length)
          )
     }
     return password
}
