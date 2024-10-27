import { Prisma, PrismaClient } from '@prisma/client'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

class FileService {
  create(data: Prisma.fileCreateInput) {
    return new Promise((resolve) => {
      const file = prisma.file.create({
        data: data,
        select: {
          id: true,
          name: true,
        },
      })
      resolve(file)
    })
  }
}

export default new FileService()
