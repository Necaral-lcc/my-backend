import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from './type'
import { DefaultArgs } from '@prisma/client/runtime/library'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

export interface sAdminUserCreateParams {
  name: string
  email?: string
  password: string
  roleId?: number
  deptId?: number
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
      const user = prisma.adminUser.findUnique({
        where: {
          name,
          deletedFlag: false,
        },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
        },
      })
      resolve(user)
    })
  }

  create(data: sAdminUserCreateParams) {
    return new Promise((resolve) => {
      const AdminUser = prisma.adminUser.upsert({
        create: {
          name: data.name,
          email: data.email,
          password: data.password,
          roleId: data.roleId,
          deptId: data.deptId,
        },
        update: {
          name: data.name,
          email: data.email,
          password: data.password,
          deletedFlag: false,
          roleId: data.roleId,
          deptId: data.deptId,
        },
        where: {
          name: data.name,
          deletedFlag: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          roleId: true,
          deptId: true,
        },
      })
      resolve(AdminUser)
    })
  }
}

export default new AdminUserService()
