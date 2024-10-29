import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from './type'
import { DefaultArgs } from '@prisma/client/runtime/library'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

class RoleService {
  create(data: Prisma.RoleCreateInput & { menuIds: number[] }) {
    const { name, menuIds } = data
    return new Promise((resolve, reject) => {
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
      resolve(role)
    })
  }

  getById(id: number): Promise<
    Prisma.Prisma__RoleClient<
      {
        name: string
        id: number
        menuOnRole: {
          menuId: number
          menu: {
            name: string
          }
        }[]
      } | null,
      null,
      DefaultArgs
    >
  > {
    return new Promise((resolve, reject) => {
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
      resolve(role)
    })
  }

  getRoles({ page, pageSize }: PageParams): Promise<
    Prisma.PrismaPromise<
      {
        name: string
        id: number
        createdAt: Date
        updatedAt: Date
        menuOnRole: {
          menuId: number
          menu: {
            name: string
          }
        }[]
      }[]
    >
  > {
    return new Promise((resolve, reject) => {
      const skip = (page - 1) * pageSize
      const roles = prisma.role.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
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
      resolve(roles)
    })
  }

  update(id: number, data: Prisma.RoleUpdateInput & { menuIds: number[] }) {
    const { name, menuIds } = data
    return new Promise((resolve, reject) => {
      const role = prisma.role.update({
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
      resolve(role)
    })
  }

  delete(id: number) {
    return new Promise((resolve, reject) => {
      const role = prisma.role.update({
        where: { id },
        data: {
          deletedFlag: true,
        },
      })
      resolve(role)
    })
  }

  getRoleOptions(): Promise<
    Prisma.PrismaPromise<
      {
        id: number
        name: string
      }[]
    >
  > {
    return new Promise((resolve, reject) => {
      const roles = prisma.role.findMany({
        where: {
          deletedFlag: false,
        },
        select: {
          id: true,
          name: true,
        },
      })
      resolve(roles)
    })
  }
}

export default new RoleService()
