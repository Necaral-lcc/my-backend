import {
  RateLimiterMemory,
  type IRateLimiterOptions,
} from 'rate-limiter-flexible'
import * as Koa from 'koa'
import { formatResponse } from '../utils'
import { Worker } from 'cluster'

const options: IRateLimiterOptions = {
  points: 20, // 6 points
  duration: 1, // Per second
}

const rateLimiter = new RateLimiterMemory(options)

/**
 * 访问限制中间件
 * @param opt IRateLimiterOptions
 * @returns
 */
export const rateLimit =
  (opt?: IRateLimiterOptions) => async (ctx: Koa.Context, next: Koa.Next) => {
    const key = `rateLimit:${ctx.request.ip}_${ctx.request.url}`
    try {
      const rateLimiterRes = await rateLimiter.consume(key)
      if (rateLimiterRes.remainingPoints === 0) {
        ctx.body = formatResponse(null, '请求太频繁，请稍后再试。', 429)
        return
      }
      const date = new Date(Date.now() + rateLimiterRes.msBeforeNext)
      const time = date.toLocaleString()
      const headers = {
        'Retry-After': rateLimiterRes.msBeforeNext / 1000,
        'X-RateLimit-Limit': rateLimiter.points,
        'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
        'X-RateLimit-Reset': time,
      }
      for (const [key, value] of Object.entries(headers)) {
        ctx.response.set(key, value.toString())
      }
      await next()
    } catch (e) {
      ctx.body = formatResponse(e, '请求太频繁，请稍后再试。', 429)
      return
    }
    return
  }
