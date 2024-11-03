import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from './type'
import prisma from '../prisma'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

class RoleService {
  createRole(name: string) {
    return new Promise((resolve, reject) => {
      const role = prisma.role.create({
        data: {
          name,
        },
        select: {
          id: true,
          name: true,
        },
      })
      resolve(role)
    })
  }
}

export default new RoleService()
