import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from './type'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { formatPageResponse } from '@/utils'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

export interface sAdminUserCreateParams {
  name: string
  email?: string
  nickname?: string
  password: string
  roleId?: number
  deptId?: number
  status?: boolean
}

type sAdminUserFind = Prisma.Prisma__AdminUserClient<
  {
    id: number
    email: string | null
    name: string
    password: string
  } | null,
  null,
  DefaultArgs
>

class AdminUserService {
  findUnique(name: string): Promise<sAdminUserFind> {
    return new Promise((resolve) => {
      const adminUser = prisma.adminUser.findUnique({
        where: {
          name,
          deletedFlag: false,
          status: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          nickname: true,
          password: true,
        },
      })
      resolve(adminUser)
    })
  }

  upsert(data: sAdminUserCreateParams) {
    return new Promise((resolve) => {
      const adminUser = prisma.adminUser.upsert({
        create: {
          name: data.name,
          nickname: data.nickname,
          email: data.email,
          password: data.password,
          roleId: data.roleId,
          deptId: data.deptId,
          status: data.status,
        },
        update: {
          name: data.name,
          nickname: data.nickname,
          email: data.email,
          password: data.password,
          deletedFlag: false,
          roleId: data.roleId,
          deptId: data.deptId,
          status: true,
        },
        where: {
          name: data.name,
        },
        select: {
          id: true,
          name: true,
          nickname: true,
          email: true,
          deletedFlag: true,
          roleId: true,
          deptId: true,
        },
      })
      resolve(adminUser)
    })
  }

  list(
    pageParams: Pick<PageParams, 'page' | 'pageSize'> & {
      name?: string
      email?: string
    }
  ) {
    return new Promise(async (resolve) => {
      const { page, pageSize, name } = pageParams
      const skip = (page - 1) * pageSize
      const where = {
        name: { contains: name },
        deletedFlag: false,
      }
      const count = await prisma.adminUser.count({
        where,
      })
      if (count === 0) {
        resolve(formatPageResponse([], page, pageSize, 0))
        return
      }
      const adminUsers = await prisma.adminUser.findMany({
        where,
        orderBy: {
          id: 'asc',
        },
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          nickname: true,
          status: true,
          email: true,
          roleId: true,
          deptId: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      if (adminUsers) {
        resolve(formatPageResponse(adminUsers, page, pageSize, count))
      } else {
        resolve(formatPageResponse([], page, pageSize, 0))
      }
    })
  }

  detail(id: number) {
    return new Promise((resolve) => {
      const adminUser = prisma.adminUser.findUnique({
        where: {
          id,
          deletedFlag: false,
        },
        select: {
          id: true,
          name: true,
          nickname: true,
          email: true,
          status: true,
          roleId: true,
          deptId: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      resolve(adminUser)
    })
  }
  formDetail(id: number) {
    return new Promise((resolve) => {
      const adminUser = prisma.adminUser.findUnique({
        where: {
          id,
          deletedFlag: false,
        },
        select: {
          id: true,
          name: true,
          nickname: true,
          email: true,
          status: true,
          roleId: true,
          deptId: true,
        },
      })
      resolve(adminUser)
    })
  }

  getById(id: number) {
    return new Promise((resolve) => {
      const adminUser = prisma.adminUser.findUnique({
        where: {
          id,
          deletedFlag: false,
        },
        select: {
          id: true,
          name: true,
        },
      })
      resolve(adminUser)
    })
  }

  update(id: number, data: Partial<sAdminUserCreateParams>) {
    const { name, password, nickname, email, roleId, deptId, status } = data
    return new Promise((resolve) => {
      const adminUser = prisma.adminUser.update({
        data: {
          name,
          nickname,
          email,
          password,
          deletedFlag: false,
          roleId,
          deptId,
          status,
        },
        where: {
          id,
          deletedFlag: false,
        },
        select: {
          id: true,
          name: true,
          nickname: true,
          email: true,
          roleId: true,
          deptId: true,
          createdAt: true,
          updatedAt: true,
          status: true,
        },
      })
      resolve(adminUser)
    })
  }

  delete(id: number) {
    return new Promise((resolve) => {
      const adminUser = prisma.adminUser.update({
        data: {
          deletedFlag: true,
        },
        where: {
          id,
          deletedFlag: false,
        },
        select: {
          id: true,
          name: true,
          nickname: true,
          email: true,
          roleId: true,
          deptId: true,
          createdAt: true,
          updatedAt: true,
          status: true,
        },
      })
      resolve(adminUser)
    })
  }

  getAdminUserInfo(id: number): Promise<
    Prisma.Prisma__AdminUserClient<
      {
        email: string | null
        name: string
        nickname: string | null
        id: number
      } | null,
      null,
      DefaultArgs
    >
  > {
    return new Promise((resolve) => {
      const adminUser = prisma.adminUser.findUnique({
        where: {
          id,
          deletedFlag: false,
        },
        select: {
          id: true,
          name: true,
          nickname: true,
          email: true,
        },
      })
      resolve(adminUser)
    })
  }
  getAdminUserRoutes(id: number): Promise<
    Prisma.Prisma__AdminUserClient<
      {
        role: {
          menuOnRole: {
            menu: {
              id: number
              name: string
              path: string | null
              title: string | null
              icon: string | null
              component: string | null
              redirect: string | null
              type: number
              link: string | null
              parentId: number | null
              permission: string | null
              keepAlive: boolean | null
              needLogin: boolean | null
            }
          }[]
        } | null
      } | null,
      null,
      DefaultArgs
    >
  > {
    return new Promise((resolve) => {
      const adminUser = prisma.adminUser.findUnique({
        where: {
          id,
          deletedFlag: false,
        },
        select: {
          role: {
            select: {
              menuOnRole: {
                where: {
                  menu: {
                    status: true,
                    deletedFlag: false,
                  },
                },
                select: {
                  menu: {
                    select: {
                      id: true,
                      name: true,
                      title: true,
                      icon: true,
                      component: true,
                      redirect: true,
                      link: true,
                      path: true,
                      type: true,
                      keepAlive: true,
                      needLogin: true,
                      parentId: true,
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      resolve(adminUser)
    })
  }

  getAdminUserPermission(
    id: number,
    per: string
  ): Promise<
    Prisma.Prisma__AdminUserClient<
      {
        role: {
          menuOnRole: {
            menu: {
              permission: string | null
            }
          }[]
        } | null
      } | null,
      null,
      DefaultArgs
    >
  > {
    return new Promise((resolve, reject) => {
      const permission = prisma.adminUser.findFirst({
        where: {
          id,
          deletedFlag: false,
        },
        select: {
          role: {
            select: {
              menuOnRole: {
                where: {
                  menu: {
                    permission: per,
                  },
                },
                select: {
                  menu: {
                    select: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      resolve(permission)
    })
  }
}

export default new AdminUserService()
