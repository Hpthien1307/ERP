import type { Request, Response, NextFunction } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../config/db.js"
import { getCookieOptions } from "../controllers/auth.controller.js"

export interface AuthRequest extends Request {
  userId?: string
  role?: string
}

interface JwtPayloadCustom extends JwtPayload {
  userId: string
  role?: string
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.accessToken
    let refreshToken = req.cookies?.refreshToken

    // Nếu không có trong cookie thì mới tìm ở Header Authorization
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    // Không tìm thấy ở cả 2 nơi
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Yêu cầu đăng nhập (Thiếu Access Token)"
      })
    }

    // Giải mã và xác thực token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayloadCustom
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      }
    })

    const tokenSession = refreshToken
      ? await prisma.session.findUnique({
          where: { refreshToken }
        })
      : null
    const isExpired = tokenSession && new Date() > tokenSession?.expiresAt
    // Nếu không có user, không có session trong DB, hoặc session đã hết hạn
    if (!user || !tokenSession || isExpired) {
      if (tokenSession && isExpired) {
        await prisma.session.delete({
          where: { id: tokenSession.id }
        })

        console.log("true delete token in db")
      }

      const cookieOptions = getCookieOptions()
      res.clearCookie("accessToken", cookieOptions)
      res.clearCookie("refreshToken", cookieOptions)
      console.log("true delete cookie")
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Người dùng không tồn tại hoặc phiên đăng nhập đã hết hạn"
      })
    }

    req.userId = decoded.userId
    req.role = decoded.role

    return next()
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Access Token đã hết hạn"
      })
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Token không hợp lệ"
    })
  }
}

export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Bạn không có quyền thực hiện hành động này"
      })
    }
    next()
  }
}
