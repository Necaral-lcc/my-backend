import { Prisma, PrismaClient } from '@prisma/client'
import prisma from '../prisma'
/**
 * Service用来处理逻辑，返回结果给Controller
 */

class FileService {
  async create(data: Prisma.fileCreateInput) {
    const file = await prisma.file.create({
      data: data,
      select: {
        id: true,
        name: true,
      },
    })
    return file
  }

  async createMany(data: Prisma.fileCreateManyInput) {
    const files = await prisma.file.createMany({
      data: data,
      skipDuplicates: true,
    })
    return files
  }
}

export default new FileService()
