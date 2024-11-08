import { deepTreeToList } from './../utils/tool'
import { sJWT } from '../types'
import * as Koa from 'koa'
import AdminUserService from '../serviceAdmin/adminUser-service'
import { formatResponse, isNumber } from '../utils'
import redis from '../redis'
import adminUserService from '../serviceAdmin/adminUser-service'
import deptService from '../serviceAdmin/dept-service'

export interface sDataPermission {
  depts: sPrismaDept[]
}

interface sPrismaDept {
  id: number
  name: string
  description: string | null
  status: boolean
  deletedFlag: boolean
  createdAt: Date
  updatedAt: Date
  parentId: number | null
}

/**
 * 接口权限验证中间件
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
/**
 * 数据权限验证中间件
 * @description 验证用户是否有数据权限,id为1的管理员拥有所有数据权限，redis缓存用户部门权限
 * @param ctx Koa.Context
 * @param next Koa.Next
 * @returns
 */
export const dataPermission =
  () => async (ctx: Koa.Context, next: Koa.Next) => {
    const { id } = ctx.state.user as sJWT
    // 管理员拥有所有数据权限
    if (id === 1) {
      // 管理员拥有所有数据权限,任何数据都可以访问
      ctx.state.dataPermission = {
        depts: [],
      } as sDataPermission
      await next()
      return
    } else {
      const redisKey = `redis:${id}:data:deptIds`
      const redisValue = await redis.get(redisKey)
      if (redisValue) {
        ctx.state.dataPermission = {
          depts: JSON.parse(redisValue),
        } as sDataPermission
        await next()
        return
      }
      const adminUser = await adminUserService.getById(id)
      if (!adminUser) {
        ctx.body = formatResponse(null, '用户不存在', 401)
        return
      }
      if (!adminUser.deptId) {
        ctx.body = formatResponse(null, '用户没有任何部门权限', 500)
        return
      }
      const dept = await deptService.getDeptById(adminUser.deptId)
      if (!dept) {
        ctx.body = formatResponse(null, '部门不存在', 500)
        return
      }
      const depts = await deepTreeToList(
        [dept],
        deptService.getDeptByParentIdWithAll
      )
      const result = await redis.set(redisKey, JSON.stringify(depts), 'EX', 60)
      if (result !== 'OK') {
        console.error('redis set failed')
        ctx.body = formatResponse(null, '服务器内部错误', 500)
        return
      }
      ctx.state.dataPermission = {
        depts,
      } as sDataPermission
      await next()
      return
    }
  }
/**
 * 验证用户是否有数据权限
 * @param ctx Koa.Context
 * @param deptId 部门id
 * @returns
 */
export const hasDataPermission = (
  ctx: Koa.Context,
  deptId?: number | string | null
) => {
  return new Promise<boolean>((resolve) => {
    const permissions = ctx.state.dataPermission as sDataPermission
    if (!deptId) {
      resolve(false)
      return
    }
    if (!isNumber(deptId)) {
      resolve(false)
      return
    }
    if (permissions.depts.length === 0) {
      // 管理员拥有所有权限
      resolve(true)
    } else if (permissions.depts.some((item) => item.id === deptId)) {
      // 用户有数据权限
      resolve(true)
    } else {
      // 用户没有数据权限
      resolve(false)
    }
  })
}
