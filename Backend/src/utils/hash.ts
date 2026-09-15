import bcrypt from "bcryptjs"

/**
 * Mã hóa mật khẩu an toàn bằng thuật toán bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const SALT_ROUNDS = 10
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Kiểm tra mật khẩu nhập vào với mật khẩu đã mã hóa lưu trong DB
 */
export const comparePassword = async (password: string, storedHash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, storedHash)
  } catch (error) {
    return false
  }
}
