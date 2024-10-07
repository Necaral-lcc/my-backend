import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

class UserService {
  info(ctx: Context) {
    const id = Number(ctx.params.id)

    return new Promise((resolve, reject) => {
      const user = prisma.user.findUnique({
        where: {
          id,
        },
      })
      resolve(user)
    })
  }

  list(ctx: Context) {
    return new Promise((resolve, reject) => {
      const page = Number(ctx.query.page) || 1
      const pageSize = Number(ctx.query.pageSize) || 10
      const order = ctx.query.order || 'id'
      const orderBy = ctx.query.orderBy || 'asc'

      const users = prisma.user.findMany({
        where: {
          deletedFlag: false,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: {
          [order.toString()]: orderBy as Prisma.SortOrder,
        },
      })
      resolve(users)
    })
  }

  getPersonInfo(params) {
    return Promise.resolve({
      data: params,
    })
  }

  postTest(params) {
    return Promise.resolve({
      data: params,
    })
  }
}

export default new UserService()
