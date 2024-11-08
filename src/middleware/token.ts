import { sJWT } from '../types'
import * as Koa from 'koa'
import { formatResponse } from '../utils'
import * as jwt from 'jsonwebtoken'
import { ADMIN_SECRET_KEY, TOKEN_KEY, JWT_EXPIRE_TIME } from '../config'
import { createToken } from '../utils/token'

/**
 * 延长token过期时间
 * @param time
 * @returns
 */
export const refreshToken =
  (time?: number) => async (ctx: Koa.Context, next: Koa.Next) => {
    const user = ctx.state.user as sJWT | undefined
    try {
      await next().then(() => {
        if (user) {
          const { id, deptId, roleId } = user
          // 延长 token 过期时间
          const token = createToken(
            { id, deptId, roleId },
            time || JWT_EXPIRE_TIME
          )
          // 设置 token 到 headers 中
          ctx.response.set(TOKEN_KEY, token)
          // headers 中设置 token 过期时间
          ctx.response.set(
            'token-expire-time',
            (time || JWT_EXPIRE_TIME).toString()
          )
        }
      })
    } catch (err) {
      ctx.body = formatResponse(err, '服务器发生错误', 500)
    }
  }
