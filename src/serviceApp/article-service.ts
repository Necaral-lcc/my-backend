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
      const article = prisma.article.create({
        data: {
          title,
          content,
          authorId: id,
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      })
      resolve(article)
    })
  }

  publishArticles(id, articles) {
    return new Promise((resolve, reject) => {
      const article = prisma.article.createMany({
        data: articles.map((article) => {
          return {
            title: article.title,
            content: article.content,
            authorId: id,
          }
        }),
      })
      resolve(article)
    })
  }

  getArticle(id: number) {
    return new Promise((resolve, reject) => {
      const article = prisma.article.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      })
      resolve(article)
    })
  }

  updateArticle(id: number, userId: number, { title, content, authorId }) {
    return new Promise((resolve, reject) => {
      const article = prisma.article.update({
        where: {
          id,
          authorId: userId,
        },
        data: {
          title,
          content,
          authorId: id,
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      })
      resolve(article)
    })
  }
}

export default new ArticleService()
