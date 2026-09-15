import type { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../config/db.js"
import { PositionValidation } from "../validations/position.validation.js"
import { STATUS_MESSAGE } from "../constant/systemMessage.js"

export class PositionController {
  public getPosition = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getPosition = await prisma.position.findMany({
        orderBy: {
          createdAt: "desc"
        }
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: getPosition
      })
    } catch (error) {
      next(error)
    }
  }

  public getDetailPosition = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = PositionValidation.getPositionId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      const getPositionData = await prisma.position.findUnique({
        where: { id: idValidation.data.id }
      })

      if (!getPositionData) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: STATUS_MESSAGE.STATUS_NOT_FOUND
        })
      }

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: getPositionData
      })
    } catch (error) {
      next(error)
    }
  }

  public createPosition = async (req: Request, res: Response, next: NextFunction) => {
    const bodydValidation = PositionValidation.createPosition.safeParse(req.body)
    if (!bodydValidation.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
        errors: bodydValidation.error.flatten().fieldErrors
      })
    }

    const { title, userIds } = bodydValidation.data

    const duplicateTitle = await prisma.position.findUnique({
      where: { title }
    })

    if (duplicateTitle) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "Vị trí/chức vụ ngày đã tồn tại"
      })
    }

    const createData = await prisma.position.create({
      data: {
        title: title || "Vị trí nhân sự",
        ...(userIds &&
          userIds.length > 0 && {
            users: {
              connect: userIds.map(userId => ({ id: userId }))
            }
          })
      },
      include: {
        users: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    })

    return res.status(StatusCodes.OK).json({
      message: STATUS_MESSAGE.STATUS_OK,
      data: createData
    })
  }

  public updatePosition = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = PositionValidation.getPositionId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      const bodyValidation = PositionValidation.updatePosition.safeParse(req.body)
      if (!bodyValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: bodyValidation.error.flatten().fieldErrors
        })
      }

      const updateData = await prisma.position.update({
        where: { id: idValidation.data.id },
        data: bodyValidation.data
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: updateData
      })
    } catch (error) {
      next(error)
    }
  }

  public deletePosition = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = PositionValidation.getPositionId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      await prisma.position.delete({
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
