import bcrypt from 'bcrypt'

export async function hashPw(pw: string) {
     return await bcrypt.hash(pw, 10)
}
