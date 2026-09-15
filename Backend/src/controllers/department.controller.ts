import type { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../config/db.js"
import { DepartmentValidation } from "../validations/departments.validation.js"
import { STATUS_MESSAGE } from "../constant/systemMessage.js"

export class DepartmentController {
  public getDp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getDp = await prisma.department.findMany({
        orderBy: { createdAt: "desc" },
        omit: {
          managerId: true
        },
        include: {
          manager: {
            select: {
              id: true,
              fullName: true
            }
          },
          users: {
            select: {
              id: true,
              fullName: true
            }
          }
        }
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: getDp
      })
    } catch (error) {
      next(error)
    }
  }

  public getDetailDp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = DepartmentValidation.getDpId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      const getData = await prisma.department.findUnique({
        where: {
          id: idValidation.data.id
        },
        omit: { managerId: true },
        include: {
          manager: {
            select: { id: true, fullName: true, email: true, avatarUrl: true }
          },
          users: {
            select: { id: true, fullName: true, email: true }
          }
        }
      })

      if (!getData) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: STATUS_MESSAGE.STATUS_NOT_FOUND
        })
      }

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: getData
      })
    } catch (error) {
      next(error)
    }
  }

  public createDp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodyValidation = DepartmentValidation.createDp.safeParse(req.body)
      if (!bodyValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: bodyValidation.error.flatten().fieldErrors
        })
      }

      const { title, managerId } = bodyValidation.data

      const duplicateTitle = await prisma.department.findUnique({
        where: { title }
      })

      if (duplicateTitle) {
        return res.status(StatusCodes.CONFLICT).json({
          message: STATUS_MESSAGE.STATUS_CONFLICT
        })
      }

      if (managerId) {
        const getManagerId = await prisma.user.findUnique({
          where: {
            id: managerId
          }
        })
        if (!getManagerId) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "Người quản lí không tồn tại"
          })
        }
      }

      const createData = await prisma.department.create({
        data: {
          title,
          managerId: managerId || null
        },
        omit: {
          managerId: true
        },
        include: {
          manager: {
            select: {
              id: true,
              fullName: true
            }
          },
          users: {
            select: {
              id: true,
              fullName: true
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

  public updateDp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = DepartmentValidation.getDpId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          messsages: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      const bodyValidation = DepartmentValidation.updateDp.safeParse(req.body)
      if (!bodyValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: bodyValidation.error.flatten().fieldErrors
        })
      }

      const createData = await prisma.department.update({
        where: {
          id: idValidation.data.id
        },
        data: bodyValidation.data
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: createData
      })
    } catch (error) {
      next(error)
    }
  }

  public deleteDp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = DepartmentValidation.getDpId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      const departmentId = idValidation.data.id

      const department = await prisma.department.findUnique({
        where: { id: departmentId },
        include: {
          _count: {
            select: {
              users: true,
              tasks: true
            }
          }
        }
      })

      if (!department) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: STATUS_MESSAGE.STATUS_NOT_FOUND
        })
      }

      // không thể xóa phòng ban nếu nhân sự còn người
      if (department._count.users > 0) {
        return res.status(StatusCodes.CONFLICT).json({
          message: `Không thể xóa phòng ban. Hiện còn ${department._count.users} nhân viên đang trực thuộc, vui lòng điều chuyển nhân sự trước.`
        })
      }

      // ko thể xóa phòng ban nếu các tasks chưa dược bàn giao/xử lí
      if (department._count.tasks > 0) {
        return res.status(StatusCodes.CONFLICT).json({
          message: `Không thể xóa phòng ban. Vẫn còn ${department._count.tasks} đầu việc liên quan cần xử lý hoặc bàn giao.`
        })
      }

      await prisma.department.delete({
        where: { id: departmentId }
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_DELETE
      })
    } catch (error) {
      next(error)
    }
  }
}
