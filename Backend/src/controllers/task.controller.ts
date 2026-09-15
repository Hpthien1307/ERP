import type { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../config/db.js"
import { TaskValidation } from "../validations/task.validation.js"
import { STATUS_MESSAGE } from "../constant/systemMessage.js"
import { io } from "../server.js"

export class TaskController {
  public getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getTask = await prisma.task.findMany({
        orderBy: {
          createdAt: "desc"
        }
      })
      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: getTask
      })
    } catch (error) {
      next(error)
    }
  }
  public getDetailTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = TaskValidation.getTaskId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      const getDetailTask = await prisma.task.findUnique({
        where: {
          id: idValidation.data.id
        }
      })

      if (!getDetailTask) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: STATUS_MESSAGE.STATUS_NOT_FOUND
        })
      }

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: getDetailTask
      })
    } catch (error) {
      next(error)
    }
  }
  public createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodyValidation = TaskValidation.createTask.safeParse(req.body)
      if (!bodyValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: bodyValidation.error.flatten().fieldErrors
        })
      }

      const { title, description, status, priority, assigneeId, creatorId, departmentId, dueDate } = bodyValidation.data
      const duplicateTitle = await prisma.task.findUnique({
        where: { title }
      })

      if (duplicateTitle) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Task này đang bị tạo trùng tên"
        })
      }

      if (departmentId) {
        const getDepartmentId = await prisma.department.findUnique({
          where: {
            id: departmentId
          }
        })

        if (!getDepartmentId) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "Phòng bàn không tồn tại"
          })
        }
      }

      const createData = await prisma.task.create({
        data: {
          title: title || "",
          description,
          status: status || "TODO",
          priority: priority || "LOW",
          assigneeId,
          creatorId,
          departmentId: departmentId || null,
          dueDate
        }
      })

      io.to(assigneeId).emit("task:assigneeId", {
        message: `Bạn vừa có 1 task mới: ${createData.title}`,
        task: createData
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_CREATE,
        data: createData
      })
    } catch (error) {
      next(error)
    }
  }
  public updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = TaskValidation.getTaskId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }
      const bodyValidation = TaskValidation.createTask.safeParse(req.body)
      if (!bodyValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: bodyValidation.error.flatten().fieldErrors
        })
      }

      const updateTask = await prisma.task.update({
        where: {
          id: idValidation.data.id
        },
        data: bodyValidation.data
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: updateTask
      })
    } catch (error) {
      next(error)
    }
  }
  public deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idValidation = TaskValidation.getTaskId.safeParse(req.params)
      if (!idValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: idValidation.error.flatten().fieldErrors
        })
      }

      await prisma.task.deleteMany({
        where: {
          id: idValidation.data.id
        }
      })

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_DELETE
      })
    } catch (error) {
      next(error)
    }
  }
}
