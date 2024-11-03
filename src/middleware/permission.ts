import { sJWT } from '../types'
import * as Koa from 'koa'
import AdminUserService from '../serviceAdmin/adminUser-service'
import { formatResponse } from '../utils'

/**
 * 权限验证中间件
 * @description 验证用户是否有权限,id为1的管理员拥有所有权限
 * @param per 权限
 * @param ctx Koa.Context
 * @param next Koa.Next
 * @returns
 */
export const authPermission =
  (per: string) => async (ctx: Koa.Context, next: Koa.Next) => {
    const { id } = ctx.state.user as sJWT
    // 管理员拥有所有权限
    if (id === 1) {
      // 管理员拥有所有权限,任何请求都可以访问
      await next()
      return
    }
    // 获取用户权限，判断是否有权限
    const userPermission = await AdminUserService.getAdminUserPermission(
      id,
      per
    )
    if (userPermission?.role?.menuOnRole.length) {
      await next()
      return
    } else {
      ctx.body = formatResponse(ctx.request.url, '没有权限', 403)
    }
  }
