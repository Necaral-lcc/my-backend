import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from './type'
import prisma from '@/prisma'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

class ArticleService {
  publishArticle(
    authorId: number,
    { title, content, publishedAt }: Prisma.ArticleCreateInput
  ) {
    return new Promise((resolve, reject) => {
      const article = prisma.article.create({
        data: {
          title,
          content,
          authorId,
          publishedAt,
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          publishedAt: true,
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

  publishArticles(id: number, articles: Prisma.ArticleCreateInput[]) {
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

  updateArticle(
    article_id: number,
    userId: number,
    {
      title,
      content,
      authorId,
    }: Prisma.ArticleUpdateInput & { authorId: number }
  ) {
    return new Promise((resolve, reject) => {
      const article = prisma.article.update({
        where: {
          id: article_id,
          authorId: userId,
        },
        data: {
          title,
          content,
          authorId,
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
