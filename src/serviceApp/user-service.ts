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
        select: {
          id: true,
          email: true,
          name: true,
          age: true,
          sex: true,
          address: true,
          phone: true,
          role: true,
          dept: true,
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

  getByEmailDeleted(email: string) {
    return new Promise((resolve, reject) => {
      const user = prisma.user.findUnique({
        where: {
          email,
          deletedFlag: true,
        },
      })
      resolve(user)
    })
  }

  create(email: string, password: string) {
    return new Promise((resolve, reject) => {
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
    })
  }

  restore(email: string, password: string) {
    return new Promise((resolve, reject) => {
      const user = prisma.user.update({
        where: {
          email,
          password,
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
    })
  }

  update(
    id: number,
    { name, age, sex, address, phone, password }: Prisma.UserUpdateInput
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
