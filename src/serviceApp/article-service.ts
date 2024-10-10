import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from './type'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

class ArticleService {
  publishArticle(id: number, { title, content }) {
    return new Promise((resolve, reject) => {
      const user = prisma.user.findUnique({
        where: {
          id: 1,
        },
      })
    })
  }
}

export default new ArticleService()
