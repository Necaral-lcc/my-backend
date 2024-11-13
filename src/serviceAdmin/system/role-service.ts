import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from '../type'
import { DefaultArgs } from '@prisma/client/runtime/library'
import prisma from '@src/prisma'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

class RoleService {
  async create(data: Prisma.RoleCreateInput & { menuIds: number[] }) {
    const { name, menuIds } = data
    const role = prisma.role.create({
      data: {
        name,
        menuOnRole: {
          createMany: {
            data: menuIds.map((id) => ({ menuId: id })),
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        menuOnRole: {
          select: {
            menuId: true,
            menu: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
    return role
  }

  async getById(id: number) {
    const role = prisma.role.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        menuOnRole: {
          where: {
            menu: {
              status: true,
            },
          },
          select: {
            menuId: true,
            menu: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
    return role
  }

  async getRoles({ page, pageSize }: PageParams) {
    const skip = (page - 1) * pageSize
    const roles = prisma.role.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            menuOnRole: true,
          },
        },
        menuOnRole: {
          where: {
            menu: {
              status: true,
            },
          },

          select: {
            menuId: true,
            menu: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
    return roles
  }

  async update(
    id: number,
    data: Prisma.RoleUpdateInput & { menuIds: number[] }
  ) {
    const { name, menuIds } = data
    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        menuOnRole: {
          deleteMany: {},
          createMany: {
            data: menuIds.map((id) => ({ menuId: id })),
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        menuOnRole: {
          select: {
            menuId: true,
            menu: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })
    return role
  }

  async delete(id: number) {
    const role = await prisma.role.update({
      where: { id },
      data: {
        deletedFlag: true,
      },
      select: {
        id: true,
        name: true,
      },
    })
    return role
  }

  async getRoleOptions() {
    const roles = await prisma.role.findMany({
      where: {
        deletedFlag: false,
      },
      select: {
        id: true,
        name: true,
      },
    })
    return roles
  }
}

export default new RoleService()
