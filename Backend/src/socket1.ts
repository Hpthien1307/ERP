import { io } from "./server.js"
import { parseCookie } from "cookie"
import jwt from "jsonwebtoken"

io.use((socket, next) => {
  try {
    const rawCookies = socket.handshake.headers.cookie
    if (!rawCookies) {
      return next(new Error("Không tìm thấy cookie xác thực"))
    }

    const parsedCookies = parseCookie(rawCookies)
    const token = parsedCookies.accessToken

    if (!token) {
      return next(new Error("Thiếu access token"))
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as {
      userId: string
      role: string
    }

    socket.data.user = decoded
    next()
  } catch (error) {}
})

io.on("connect", socket => {
  const user = socket.data.user
  console.log(`User kết nối thành công: ${user.userId}`)

  socket.join(user.userId)

  socket.on("disconnect", () => {
    console.log(`User ngắt kết nối: ${user.userId}`)
  })
})
