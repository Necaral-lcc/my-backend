/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import userService from '@/serviceApp/user-service'
import articleService from '@/serviceApp/article-service'
import { Prisma } from '@prisma/client'
import { isEmail, isPassword, formatResponse } from '@/utils'
import * as jwt from 'jsonwebtoken'
import { TOKEN_KEY, JWT_EXPIRE_TIME } from '@/config'
import * as dayjs from 'dayjs'

/**
 * 用户发布单个文章
 * @param ctx
 */
export const publishArticle = async (ctx: Context) => {
  const { id, email } = ctx.state.user
  const timezoneOffset = ctx.request.header['timezone-offset']
  const { title, content, publishedAt } = ctx.request
    .body as Prisma.ArticleCreateInput
  if (title && content) {
    const result = await articleService.publishArticle(Number(id), {
      title,
      content,
      publishedAt: publishedAt ? dayjs(publishedAt).toString() : null,
    })
    if (result) {
      ctx.body = formatResponse(result, '发布成功')
    } else {
      ctx.body = formatResponse(null, '发布失败', 500)
    }
  } else {
    ctx.body = formatResponse(null, '标题和内容不能为空', 400)
  }
}
