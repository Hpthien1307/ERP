import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"
import type { Request, Response, NextFunction } from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { StatusCodes } from "http-status-codes"
import { parseCookie } from "cookie"
import jwt from "jsonwebtoken"
// routes all endpoint
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import positionRouter from "./routes/position.routes.js"
import departmentRouter from "./routes/department.routes.js"
import attendanceRouter from "./routes/attendance.routes.js"
import requestRouter from "./routes/request.routes.js"
import taskRouter from "./routes/task.routes.js"
import notificationRouter from "./routes/notification.routes.js"

// Load environment variables
dotenv.config()

if (!process.env.ACCESS_TOKEN_SECRET) {
  console.warn("⚠️ Warning: ACCESS_TOKEN_SECRET is not set in environment variables!")
}

const app = express()
const PORT = process.env.PORT || 8080

// Global Middlewares
app.use(helmet())
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true
  })
)

// kiểm tra môi trường
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
} else {
  app.use(morgan("combined"))
}

// Middleware để xử lý request body
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

// Middleware để đọc cookie
app.use(cookieParser())

const httpSever = createServer(app)

export const io = new Server(httpSever, {
  cors: {
    origin: process.env.FRONTEND_URL, // URL Frontend
    credentials: true // Cho phép truyền cookie qua kết nối socket
  }
})

// SOCKET AUTHENTICATION
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
  } catch (error) {
    console.error("❌ Socket authentication error:", error)

    next(new Error("Xác thực socket thất bại"))
  }
})

// SOCKET CONNECTION
io.on("connection", socket => {
  const user = socket.data.user

  console.log("🟢 User kết nối Socket")
  console.log("User ID:", user.userId)
  console.log("Role:", user.role)
  console.log("Socket ID:", socket.id)

  // Mỗi user có một room riêng
  socket.join(user.userId)

  console.log(`📌 Joined room: ${user.userId}`)

  socket.on("disconnect", reason => {
    console.log(`🔴 User ${user.userId} ngắt kết nối. Reason: ${reason}`)
  })
})

// Cổng API
app.use("/api/auth", authRouter)
app.use("/api", userRouter)
app.use("/api", positionRouter)
app.use("/api", departmentRouter)
app.use("/api", attendanceRouter)
app.use("/api", requestRouter)
app.use("/api", taskRouter)
app.use("/api", notificationRouter)

// Basic Health Check Route
app.get("/health", (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    message: "Server is running smoothly"
  })
})

// routes trả lỗi dạng json dễ debug ở môi trường develop và production
app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.url}`
  })
})

// routes in toàn bộ chi tiết lỗi (Stack trace) ra terminal để bạn dễ dàng debug.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err)
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" ? "An unexpected error occurred" : err.message
  })
})

// Khởi tạo server
httpSever.listen(PORT, () => {
  console.log(`Đã khởi động server tại cổng http://localhost:${PORT}`)
  console.log(`Health check available at: http://localhost:${PORT}/health`)
})
