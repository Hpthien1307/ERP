import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../config/db.js"
import { AuthValidation } from "../validations/auth.validation.js"
import { STATUS_MESSAGE } from "../constant/systemMessage.js"
import type { AuthRequest } from "../middlewares/auth.middleware.js"
import { hashToken } from "../utils/hashToken.utils.js"

const ACCESS_TOKEN_JWT_EXP = "15m"
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60 * 1000 // 15 phút
const REFESH_TOKEN_TTL = 1 * 24 * 60 * 60 * 1000 // 1 ngày

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production"
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const)
  }
}

export class AuthController {
  public signin = async (req: Request, res: Response, next: NextFunction) => {
    const bodyValidation = AuthValidation.signin.safeParse(req.body)
    if (!bodyValidation.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
        errors: bodyValidation.error.flatten().fieldErrors
      })
    }

    const { email, password } = bodyValidation.data

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Tài khoản hoặc mật khẩu không đúng"
      })
    }

    const cookieOptions = getCookieOptions()
    const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: ACCESS_TOKEN_JWT_EXP
    })
    const refreshToken = crypto.randomBytes(64).toString("hex")
    const refreshTokenHash = hashToken(refreshToken)
    const expiresAt = new Date(Date.now() + REFESH_TOKEN_TTL)

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: refreshTokenHash,
        expiresAt
      }
    })

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_TTL_SECONDS
    })

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: REFESH_TOKEN_TTL
    })

    return res.status(StatusCodes.OK).json({
      message: "Đăng nhập thành công",
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      }
    })
  }

  public signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getRefreshToken = req.cookies?.refreshToken
      if (!getRefreshToken) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thầy refreshToken trong cookies "
        })
      }

      const getRefreshTokenHash = hashToken(getRefreshToken)

      const existingSession = await prisma.session.findUnique({
        where: {
          refreshToken: getRefreshTokenHash
        }
      })

      if (!existingSession) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy refreshToken"
        })
      }

      await prisma.session.delete({
        where: {
          id: existingSession.id
        }
      })

      const cookieOptions = getCookieOptions()
      res.clearCookie("accessToken", cookieOptions)
      res.clearCookie("refreshToken", cookieOptions)

      return res.status(StatusCodes.OK).json({
        message: "Đăng xuất thành công"
      })
    } catch (error) {
      next(error)
    }
  }

  public getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId

      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Yêu cầu đăng nhập"
        })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        omit: {
          password: true,
          departmentId: true,
          positionId: true
        },
        include: {
          department: {
            select: {
              id: true,
              title: true,
              users: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  role: true,
                  avatarUrl: true
                }
              }
            }
          },
          position: {
            select: { id: true, title: true }
          }
        }
      })

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Người dùng không tồn tại"
        })
      }

      return res.status(StatusCodes.OK).json({
        message: "Lấy thông tin thành công",
        data: user
      })
    } catch (error) {
      next(error)
    }
  }

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const oldRefreshToken = req.cookies?.refreshToken
      if (!oldRefreshToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Yêu cầu đăng nhập"
        })
      }
      const oldRefreshTokenHash = hashToken(oldRefreshToken)

      const existingSession = await prisma.session.findUnique({
        where: {
          refreshToken: oldRefreshTokenHash
        },
        include: {
          user: true
        }
      })

      const cookieOptions = getCookieOptions()

      if (!existingSession || new Date() > existingSession.expiresAt) {
        res.clearCookie("accessToken", cookieOptions)
        res.clearCookie("refreshToken", cookieOptions)
        // refresh token hết hạn nhưng do trong table Session vẫn còn dữ liệu nên phải xóa triệt để
        if (existingSession) {
          await prisma.session.delete({
            where: {
              id: existingSession.id
            }
          })
        }

        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại !"
        })
      }

      // Refresh Token Rotation
      const user = existingSession.user
      await prisma.session.delete({
        where: {
          id: existingSession.id
        }
      })

      const newAccessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: ACCESS_TOKEN_JWT_EXP
      })
      const newRefreshToken = crypto.randomBytes(64).toString("hex")
      const newRefreshTokenHash = hashToken(newRefreshToken)
      const newExpiresAt = new Date(Date.now() + REFESH_TOKEN_TTL)

      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken: newRefreshTokenHash,
          expiresAt: newExpiresAt
        }
      })

      res.cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_TTL_SECONDS
      })

      res.cookie("refreshToken", newRefreshToken, {
        ...cookieOptions,
        maxAge: REFESH_TOKEN_TTL
      })

      return res.status(StatusCodes.OK).json({
        message: "Cấp lại token thành công"
      })
    } catch (error) {
      next(error)
    }
  }

  public deleteSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Yêu cầu đăng nhập"
        })
      }

      const allSessions = await prisma.session.findMany({
        where: {
          userId: userId
        },
        select: {
          id: true
        }
      })

      await prisma.session.deleteMany({
        where: {
          id: {
            in: allSessions.map(session => session.id)
          }
        }
      })

      return res.status(StatusCodes.OK).json({
        message: "Xoá session thành công"
      })
    } catch (error) {
      next(error)
    }
  }
}
