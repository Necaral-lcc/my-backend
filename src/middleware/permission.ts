import { sJWT } from '@/types'
import * as Koa from 'koa'
import AdminUserService from '@/serviceAdmin/adminUser-service'
import { formatResponse } from '@/utils'

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
    if (id === 1) {
      await next()
      return
    }
    const userPermission = await AdminUserService.getAdminUserPermission(
      id,
      per
    )
    if (userPermission?.role?.menuOnRole.length) {
      await next()
      return
    } else {
      ctx.body = formatResponse(null, '没有权限', 403)
    }
  }
