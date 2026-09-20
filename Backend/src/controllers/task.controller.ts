import type { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../config/db.js"
import { TaskValidation } from "../validations/task.validation.js"
import { STATUS_MESSAGE } from "../constant/systemMessage.js"
import { io } from "../server.js"
import type { AuthRequest } from "../middlewares/auth.middleware.js"
import { createNotification, NotificationType } from "../services/notification.service.js"

export class TaskController {
  public getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryValidation = TaskValidation.getPaginatedTask.safeParse(req.query)
      if (!queryValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: queryValidation.error.flatten().fieldErrors
        })
      }
      const { page, limit, search, priority, status, assigneeId } = queryValidation.data
      const skip = (page - 1) * limit
      const whereCondition = {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assigneeId && { assigneeId }),
        ...(search && {
          title: {
            contains: search,
            mode: "insensitive" as const
          }
        })
      }

      const getTask = await prisma.task.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        },
        omit: {
          assigneeId: true,
          creatorId: true,
          departmentId: true,
          createdAt: true
        },
        include: {
          assignee: {
            select: {
              id: true,
              fullName: true
            }
          },
          creator: {
            select: {
              id: true,
              fullName: true
            }
          }
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

  public getMyTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!
      const queryValidation = TaskValidation.getPaginatedTask.safeParse(req.query)
      if (!queryValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: queryValidation.error.flatten().fieldErrors
        })
      }
      const { page, limit, search, priority, status, assigneeId } = queryValidation.data
      const skip = (page - 1) * limit

      const whereCondition = {
        assigneeId: userId,
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assigneeId && { assigneeId }),
        ...(search && {
          title: {
            contains: search,
            mode: "insensitive" as const // Tìm kiếm không phân biệt hoa/thường (Postgres)
          }
        })
      }

      const [myTasks, total] = await Promise.all([
        prisma.task.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          },
          omit: {
            assigneeId: true,
            creatorId: true,
            departmentId: true,
            createdAt: true
          },
          include: {
            assignee: {
              select: {
                id: true,
                fullName: true
              }
            },
            creator: {
              select: { id: true, fullName: true }
            },
            department: {
              select: { id: true, title: true }
            }
          }
        }),
        prisma.task.count({ where: whereCondition })
      ])

      return res.status(StatusCodes.OK).json({
        message: STATUS_MESSAGE.STATUS_OK,
        data: myTasks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      next(error)
    }
  }

  public createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const bodyValidation = TaskValidation.createTask.safeParse(req.body)
      if (!bodyValidation.success) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: STATUS_MESSAGE.STATUS_BAD_REQUEST,
          errors: bodyValidation.error.flatten().fieldErrors
        })
      }

      const { title, description, status, priority, assigneeId, creatorId, departmentId, dueDate } = bodyValidation.data

      if (title) {
        const duplicateTitle = await prisma.task.findUnique({
          where: { title }
        })

        if (duplicateTitle) {
          return res.status(StatusCodes.CONFLICT).json({
            message: "Task này đang bị tạo trùng tên"
          })
        }
      }

      const finalCreatorId = creatorId || req.userId!
      const finalAssigneeId = assigneeId || finalCreatorId

      const getAssignee = await prisma.user.findUnique({
        where: { id: finalAssigneeId }
      })

      if (!getAssignee) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Người thực hiện (assignee) không tồn tại"
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
          assigneeId: finalAssigneeId,
          creatorId: finalCreatorId,
          departmentId: departmentId || null,
          dueDate: dueDate ? new Date(dueDate) : new Date()
        },
        include: {
          creator: {
            select: {
              id: true,
              fullName: true
            }
          }
        }
      })

      io.to(finalAssigneeId).emit("task:assigneeId", {
        message: `Bạn vừa có 1 task mới: ${createData.title}`,
        task: createData
      })

      // Gửi thông báo cho nhân viên (assignee) khi được giao task
      if (finalAssigneeId !== finalCreatorId) {
        await createNotification({
          userId: finalAssigneeId,
          type: NotificationType.NEW_TASK,
          title: "Bạn có task mới",
          message: `${createData.creator.fullName} đã giao cho bạn task "${createData.title}"`,
          taskId: createData.id
        })
      }

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
