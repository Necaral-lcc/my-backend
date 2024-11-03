import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from './type'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { formatPageResponse } from '../utils'
import prisma from '../prisma'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

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
  async findUnique(name: string) {
    const adminUser = await prisma.adminUser.findUnique({
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
    return adminUser
  }

  async upsert(data: sAdminUserCreateParams) {
    const adminUser = await prisma.adminUser.upsert({
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
    return adminUser
  }

  async list(
    pageParams: Pick<PageParams, 'page' | 'pageSize'> & {
      name?: string
      email?: string
    }
  ) {
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
      return formatPageResponse([], page, pageSize, 0)
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
      return formatPageResponse(adminUsers, page, pageSize, count)
    } else {
      return formatPageResponse([], page, pageSize, 0)
    }
  }

  async detail(id: number) {
    const adminUser = await prisma.adminUser.findUnique({
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
    return adminUser
  }
  async formDetail(id: number) {
    const adminUser = await prisma.adminUser.findUnique({
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
    return adminUser
  }

  async getById(id: number) {
    const adminUser = await prisma.adminUser.findUnique({
      where: {
        id,
        deletedFlag: false,
      },
      select: {
        id: true,
        name: true,
      },
    })
    return adminUser
  }

  async update(id: number, data: Partial<sAdminUserCreateParams>) {
    const { name, password, nickname, email, roleId, deptId, status } = data
    const adminUser = await prisma.adminUser.update({
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
    return adminUser
  }

  async delete(id: number) {
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
    return adminUser
  }

  async getAdminUserInfo(id: number) {
    const adminUser = await prisma.adminUser.findUnique({
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
    return adminUser
  }
  async getAdminUserRoutes(id: number) {
    const adminUser = await prisma.adminUser.findUnique({
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
    return adminUser
  }

  async getAdminUserPermission(id: number, per: string) {
    const permission = await prisma.adminUser.findFirst({
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
    return permission
  }
}

export default new AdminUserService()
