import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from './type'
import prisma from '@/prisma'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

class UserService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
        password,
        deletedFlag: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
    return user
  }

  async get(id: number) {
    const user = await prisma.user.findUnique({
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
      },
    })
    return user
  }

  async getByEmail(email: string) {
    const user = prisma.user.findUnique({
      where: {
        email,
        deletedFlag: false,
      },
    })
    return user
  }

  async getByEmailDeleted(email: string) {
    const user = prisma.user.findUnique({
      where: {
        email,
        deletedFlag: true,
      },
    })
    return user
  }

  async create(email: string, password: string) {
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },

      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })
    return user
  }

  async restore(email: string, password: string) {
    const user = await prisma.user.update({
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
    return user
  }

  async update(
    id: number,
    { name, age, sex, address, phone, password }: Prisma.UserUpdateInput
  ) {
    const user = await prisma.user.update({
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
    return user
  }

  async delete(id: number) {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    })
    return user
  }

  async deleteSelf(id: number) {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedFlag: true,
      },
    })
    return user
  }
}

export default new UserService()
