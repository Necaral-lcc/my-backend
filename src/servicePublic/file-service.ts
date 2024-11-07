import { Prisma, PrismaClient } from '@prisma/client'
import prisma from '../prisma'
/**
 * Service用来处理逻辑，返回结果给Controller
 */

class FileService {
  async create(data: Prisma.fileCreateInput) {
    console.log('data', data)

    const file = await prisma.file.create({
      data,
      select: {
        id: true,
        name: true,
        previousName: true,
        filePath: true,
        mimetype: true,
        size: true,
        hash: true,
      },
    })
    return file
  }

  async findUnique(hash: string) {
    console.log('findUnique hash', hash)
    const file = await prisma.file.findUnique({
      where: {
        hash,
      },
      select: {
        id: true,
        name: true,
        previousName: true,
        filePath: true,
        mimetype: true,
        size: true,
        hash: true,
      },
    })
    return file
  }
}

export default new FileService()
