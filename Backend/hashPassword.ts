// hashPassword.ts (tạo tạm trong thư mục Backend, xóa sau khi dùng xong)
import bcrypt from "bcrypt"

const password = process.argv[2]

if (!password) {
  console.log("Cách dùng: npx tsx hashPassword.ts <mật_khẩu>")
  process.exit(1)
}

const hash = await bcrypt.hash(password, 10)
console.log(hash)
