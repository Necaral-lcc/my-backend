import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from '../type'
import prisma from '@src/prisma'
import { sPrismaDept } from '@src/middleware/permission'
import { formatPageResponse } from '@src/utils'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

class UserService {
  async findUnique(email: string) {
    const user = prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
    return user
  }

  create(data: Omit<Prisma.UserCreateInput, 'dept'> & { deptId?: number }) {
    const user = prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        deptId: true,
      },
    })
    return user
  }

  getUserByIdUnderDepts(id: number, depts: sPrismaDept[] = []) {
    const where: Prisma.UserWhereInput = {
      AND: [
        {
          id,
        },
      ],
    }
    if (depts.length > 0) {
      where.OR = depts.map((dept) => ({
        deptId: dept.id,
      }))
    }
    const user = prisma.user.findFirst({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        deptId: true,
      },
    })
    return user
  }

  async update(
    id: number,
    data: Omit<Prisma.UserUpdateInput, 'dept'> & { deptId?: number }
  ) {
    return prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        deptId: true,
      },
    })
  }

  async delete(id: number) {
    return prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        deptId: true,
      },
    })
  }

  async getUserList(where: Prisma.UserWhereInput, pageParams: PageParams) {
    const list = await prisma.user.findMany({
      where,
      skip: (pageParams.page - 1) * pageParams.pageSize,
      take: pageParams.pageSize,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        dept: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    const total = await prisma.user.count({
      where,
    })
    return formatPageResponse(list, pageParams.page, pageParams.pageSize, total)
  }

  async getUserEmailRepeat(params: Prisma.UserWhereUniqueInput) {
    return prisma.user.findFirst({
      where: {
        id: {
          not: params.id,
        },
        email: params.email,
      },
    })
  }
}

export default new UserService()
