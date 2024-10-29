/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import roleService from '@/serviceAdmin/role-service'
import { Prisma } from '@prisma/client'
import {
  isEmail,
  isPassword,
  formatResponse,
  isNumber,
  formatPageResponse,
} from '@/utils'
import * as jwt from 'jsonwebtoken'
import { SECRET_KEY, TOKEN_KEY, JWT_EXPIRE_TIME } from '@/config'
import PageService from '@/servicePublic/page-service'

/**
 * 创建角色
 * @param ctx
 */
export const createRole = async (ctx: Context) => {
  const { name, menuIds } = ctx.request.body as {
    name: string
    menuIds: any[]
  }
  if (!name.trim()) {
    ctx.body = formatResponse(null, '角色名称不能为空', 500)
    return
  }
  const isNum =
    Array.isArray(menuIds) && menuIds.every((item) => isNumber(item))
  if (!isNum) {
    ctx.body = formatResponse(null, '菜单ID必须为数字', 500)
    return
  }

  try {
    const role = await roleService.create({ name, menuIds })
    if (role) {
      ctx.body = formatResponse(role, '角色创建成功')
    } else {
      ctx.body = formatResponse(null, '角色创建失败', 500)
    }
  } catch (error) {
    ctx.body = formatResponse(error, '角色创建失败', 500)
  }
}

/**
 * 获取角色列表
 * @param ctx
 */
export const getRoles = async (ctx: Context) => {
  try {
    const p = await PageService.isPage(ctx)
    const { page, pageSize } = p
    const roles = await roleService.getRoles({
      page: Number(page),
      pageSize: Number(pageSize),
    })
    if (roles) {
      const list = roles.map((item) => {
        return {
          id: item.id,
          name: item.name,
          menuIds: item.menuOnRole.map((cItem) => cItem.menuId),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }
      })
      ctx.body = formatResponse(
        formatPageResponse(list, page, pageSize, roles.length),
        '获取角色成功'
      )
    } else {
      ctx.body = formatResponse(null, '获取角色失败', 500)
    }
  } catch (error) {
    ctx.body = formatResponse(error, '获取角色失败', 500)
  }
}
/**
 * 获取角色详情
 * @param ctx
 * @returns
 */
export const getRole = async (ctx: Context) => {
  const { id } = ctx.params
  try {
    if (!id || !isNumber(id)) {
      ctx.body = formatResponse(null, '参数错误', 500)
      return
    }
    const role = await roleService.getById(Number(id))
    if (role) {
      const obj: { id: number; name: string; menuIds: number[] } = {
        id: role.id,
        name: role.name,
        menuIds: [],
      }
      obj.menuIds = role.menuOnRole.map((cItem) => cItem.menuId)
      ctx.body = formatResponse(obj, '获取角色成功')
    } else {
      ctx.body = formatResponse(null, '获取角色失败', 500)
    }
  } catch (error) {
    ctx.body = formatResponse(error, '获取角色失败', 500)
    return
  }
}
/**
 * 更新角色详情
 * @param ctx
 * @returns
 */
export const updateRole = async (ctx: Context) => {
  const { id } = ctx.params
  const { name, menuIds } = ctx.request.body as {
    name: string
    menuIds: any[]
  }
  if (!id || !isNumber(id)) {
    ctx.body = formatResponse(null, '参数错误', 500)
    return
  }
  if (!name.trim()) {
    ctx.body = formatResponse(null, '角色名称不能为空', 500)
    return
  }
  const isNum =
    Array.isArray(menuIds) && menuIds.every((item) => isNumber(item))
  if (!isNum) {
    ctx.body = formatResponse(null, '菜单ID必须为数字', 500)
    return
  }
  try {
    const role = await roleService.update(Number(id), { name, menuIds })
    if (role) {
      ctx.body = formatResponse(role, '更新角色成功')
    } else {
      ctx.body = formatResponse(null, '更新角色失败', 500)
    }
  } catch (error) {
    ctx.body = formatResponse(error, '更新角色失败', 500)
  }
}
/**
 * 删除角色
 * @param ctx
 * @returns
 */
export const deleteRole = async (ctx: Context) => {
  const { id } = ctx.params
  if (!id || !isNumber(id)) {
    ctx.body = formatResponse(null, '参数错误', 500)
    return
  }
  try {
    const role = await roleService.delete(Number(id))
    if (role) {
      ctx.body = formatResponse('ok', '删除角色成功')
    } else {
      ctx.body = formatResponse(null, '删除角色失败', 500)
    }
  } catch (error) {
    ctx.body = formatResponse(error, '删除角色失败', 500)
  }
}

export const getRoleOptions = async (ctx: Context) => {
  try {
    const options = await roleService.getRoleOptions()
    if (options) {
      ctx.body = formatResponse(options, '获取角色选项成功')
    }
  } catch (error) {
    ctx.body = formatResponse(error, '获取角色选项失败', 500)
  }
}
