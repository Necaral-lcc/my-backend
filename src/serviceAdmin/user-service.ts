import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from './type'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

class UserService {
  login(email: string, password: string) {
    return new Promise((resolve) => {
      const user = prisma.user.findUnique({
        where: {
          email,
          password,
          deletedFlag: false,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          dept: true,
        },
      })
      resolve(user)
    })
  }

  get(id: number) {
    return new Promise((resolve, reject) => {
      const user = prisma.user.findUnique({
        where: {
          id,
          deletedFlag: false,
        },
      })
      resolve(user)
    })
  }

  getByEmail(email: string) {
    return new Promise((resolve, reject) => {
      const user = prisma.user.findUnique({
        where: {
          email,
          deletedFlag: false,
        },
      })
      resolve(user)
    })
  }

  list(params: PageParams) {
    const { pageSize, page, order, orderBy } = params
    return new Promise((resolve, reject) => {
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

  create(email: string, password: string) {
    return new Promise((resolve, reject) => {
      const userDeleted = prisma.user.findUnique({
        where: {
          email,
          deletedFlag: true,
        },
      })
      if (userDeleted) {
        const user = prisma.user.update({
          where: {
            email,
            deletedFlag: true,
          },
          data: {
            deletedFlag: false,
            password,
          },
          select: {
            id: true,
            email: true,
          },
        })
        resolve(user)
      } else {
        const user = prisma.user.create({
          data: {
            email,
            password,
          },
          select: {
            id: true,
            email: true,
          },
        })
        resolve(user)
      }
    })
  }

  update(
    id: number,
    {
      name,
      age,
      sex,
      address,
      phone,
      password,
      role,
      dept,
    }: Prisma.UserUpdateInput
  ) {
    return new Promise((resolve, reject) => {
      const user = prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          age,
          sex,
          address,
          phone,
          password,
          role,
          dept,
        },
      })
      resolve(user)
    })
  }

  delete(id: number) {
    return new Promise((resolve, reject) => {
      const user = prisma.user.delete({
        where: {
          id,
        },
      })
      resolve(user)
    })
  }

  deleteSelf(id: number) {
    return new Promise((resolve, reject) => {
      const user = prisma.user.update({
        where: {
          id,
        },
        data: {
          deletedFlag: true,
        },
      })
      resolve(user)
    })
  }
}

export default new UserService()
