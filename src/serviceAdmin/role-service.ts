import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

class RoleService {}

export default new RoleService()
