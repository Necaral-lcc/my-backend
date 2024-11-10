import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from './type'
import prisma from '../prisma'
import { sPrismaDept } from '../middleware/permission'
import { formatPageResponse } from '../utils'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

class UserService {
  findUnique(email: string) {
    return new Promise((resolve) => {
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
      resolve(user)
    })
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
        deptId: true,
      },
    })
    const total = await prisma.user.count({
      where,
    })
    return formatPageResponse(list, pageParams.page, pageParams.pageSize, total)
  }
}

export default new UserService()
