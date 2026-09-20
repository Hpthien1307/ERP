import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../config/db.js"
import { UserValidation } from "../validations/user.validation.js"
import { STATUS_MESSAGE } from "../constant/systemMessage.js"

export class UserController {
  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getUsers = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        omit: {
          password: true,
          positionId: true,
          departmentId: true
        },
        include: {
          department: {
            select: {
              id: true,
              title: true
            }
          },
          position: {
            select: {
              id: true,
              title: true
            }
          }
        }
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: getUsers
      })
    } catch (error) {
      next(error)
    }
  }

  public getDetailUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = UserValidation.getUserId.safeParse(req.params)

      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      const getUserData = await prisma.user.findUnique({
        where: { id: idValidation.data.id },
        omit: {
          password: true,
          positionId: true,
          departmentId: true
        },
        include: {
          department: {
            select: {
              id: true,
              title: true
            }
          },
          position: {
            select: {
              id: true,
              title: true
            }
          }
        }
      })

      if (!getUserData) {
        return res.status(StatusCodes.NOT_FOUND).json({
          statusCode: StatusCodes.NOT_FOUND,
          message: STATUS_MESSAGE.STATUS_NOT_FOUND
        })
      }

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: getUserData
      })
    } catch (error) {
      next(error)
    }
  }

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createUser = UserValidation.createUser.safeParse(req.body)
      if (!createUser.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: createUser.error.flatten().fieldErrors
        })
      }

      const { email, password, fullName, avatarUrl, gender, address, birthday, bio, role, departmentId, positionId, phone, leaveBalance } =
        createUser.data

      const duplicate = await prisma.user.findUnique({
        where: { email: email }
      })

      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({
          message: STATUS_MESSAGE.STATUS_CONFLICT
        })
      }

      if (departmentId) {
        const getDepartmentId = await prisma.department.findUnique({
          where: { id: departmentId }
        })

        if (!getDepartmentId) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "Phòng bàn không tồn tại"
          })
        }
      }

      if (positionId) {
        const getPositionId = await prisma.position.findUnique({
          where: { id: positionId }
        })
        if (!getPositionId) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "Vị trí không tồn tại"
          })
        }
      }

      const passwordHash = await bcrypt.hash(password, 10)

      const createData = await prisma.user.create({
        data: {
          fullName,
          email,
          password: passwordHash,
          avatarUrl: avatarUrl || null,
          address: address || null,
          birthday: birthday || null,
          gender: gender || "MALE",
          bio: bio || null,
          role: role || "EMPLOYEE",
          departmentId: departmentId || null,
          positionId: positionId || null,
          phone: phone || null,
          leaveBalance: leaveBalance || 12
        },
        omit: {
          password: true,
          positionId: true,
          departmentId: true
        },
        include: {
          department: {
            select: {
              id: true,
              title: true
            }
          },
          position: {
            select: {
              id: true,
              title: true
            }
          }
        }
      })

      return res.status(StatusCodes.CREATED).json({
        message: STATUS_MESSAGE.STATUS_CREATE,
        data: createData
      })
    } catch (error) {
      next(error)
    }
  }

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = UserValidation.getUserId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      const bodyValidation = UserValidation.updateUser.safeParse(req.body)
      if (!bodyValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: bodyValidation.error.flatten().fieldErrors
        })
      }

      const updatePayload = { ...bodyValidation.data }

      if (updatePayload.password) {
        updatePayload.password = await bcrypt.hash(updatePayload.password, 10)
      }

      const updateUser = await prisma.user.update({
        where: { id: idValidation.data.id },
        data: updatePayload,
        omit: { password: true }
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: updateUser
      })
    } catch (error) {
      next(error)
    }
  }

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = UserValidation.getUserId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      await prisma.user.delete({
        where: { id: idValidation.data.id }
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_DELETE
      })
    } catch (error) {
      next(error)
    }
  }
}
