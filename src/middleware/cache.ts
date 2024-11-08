import { sJWT } from '../types'
import * as Koa from 'koa'
import { formatResponse } from '../utils'
import redis from '../redis'

/**
 * 缓存中间件
 * @param time
 * @param ctx
 * @param next
 * @returns
 */
export const cache =
  (time?: number) => async (ctx: Koa.Context, next: Koa.Next) => {
    const id = ctx.state.user.id as number
    // 缓存GET请求
    if (ctx.method === 'GET' || ctx.method === 'get') {
      // 缓存key
      const redisKey = `redis:${id}:${ctx.method}:${
        ctx.request.url
      }:${JSON.stringify(ctx.request.body)}`
      // 先从缓存中获取数据
      const redisData = await redis.get(redisKey)
      // 如果缓存中有数据，直接返回缓存数据
      if (redisData) {
        console.log('cache hit', redisKey)
        ctx.response.body = JSON.parse(redisData)
        return
      }
      // 如果缓存中没有数据，传递redisKey到下一个中间件
      ctx.state.redisKey = redisKey
      await next().then(async () => {
        // 缓存数据
        redis.set(
          redisKey,
          JSON.stringify(ctx.response.body),
          'EX',
          time || 120
        )
      })
    } else {
      await next()
      return
    }
  }
