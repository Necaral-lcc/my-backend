/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import menuService from '@/serviceAdmin/menu-service'
import { Prisma } from '@prisma/client'
import { isEmail, isPassword, formatResponse, isNumber } from '@/utils'
import * as jwt from 'jsonwebtoken'
import { SECRET_KEY, TOKEN_KEY, JWT_EXPIRE_TIME } from '@/config'

/**
 * 用户创建权限菜单
 * @param ctx
 */
export const createMenu = async (ctx: Context) => {
  const {
    name,
    title,
    icon,
    path,
    type,
    component,
    redirect,
    status,
    parentId,
    keepAlive,
    needLogin,
    link,
  } = ctx.request.body as Prisma.MenuCreateInput & { parentId: number }

  if (name === undefined) {
    ctx.body = formatResponse(null, '请输入菜单名称')
    return
  }

  if (path === undefined) {
    ctx.body = formatResponse(null, '请输入菜单路径')
    return
  }
  let parent_id = parentId == 0 ? null : parentId
  try {
    const menu = await menuService.createMenu(
      {
        name,
        icon,
        path,
        component,
        redirect,
        status,
        type,
        title,
        keepAlive,
        needLogin,
        link,
      },
      parent_id
    )
    if (menu) {
      ctx.body = formatResponse(menu, '菜单创建成功')
    } else {
      ctx.body = formatResponse(null, '菜单创建失败')
    }
  } catch (e) {
    ctx.body = formatResponse(e, '菜单创建失败')
  }
}

export const getMenu = async (ctx: Context) => {
  const { id } = ctx.params
  if (isNumber(id) && Number(id) > 0) {
    const menu = await menuService.getMenuById(Number(id))
    if (menu) {
      if (menu.parentId === null) {
        menu.parentId = 0
      }
      ctx.body = formatResponse(menu, '菜单获取成功')
    } else {
      ctx.body = formatResponse(null, '菜单获取失败')
    }
  } else {
    ctx.body = formatResponse(null, '请输入菜单id')
  }
}

export const getMenus = async (ctx: Context) => {
  const page = ctx.query.page || 1
  const pageSize = ctx.query.pageSize || 10
  if (!(typeof page === 'string') || isNaN(Number(page))) {
    ctx.body = formatResponse(null, '请输入正确的页码')
    return
  }
  if (!(typeof pageSize === 'string') || isNaN(Number(pageSize))) {
    ctx.body = formatResponse(null, '请输入正确的每页条数')
    return
  }
  const menus = await menuService.getMenuList({
    page: Number(page),
    pageSize: Number(pageSize),
  })
  if (menus) {
    ctx.body = formatResponse(menus, '菜单列表获取成功')
  } else {
    ctx.body = formatResponse(null, '菜单列表获取失败')
  }
}

export const getMenuTree = async (ctx: Context) => {
  const menus = await menuService.getMenuTree()
  if (menus) {
    menus.forEach((menu) => {
      if (menu.parentId === null) {
        menu.parentId = 0
      }
    })
    ctx.body = formatResponse(menus, '菜单树获取成功')
  } else {
    ctx.body = formatResponse(null, '菜单树获取失败')
  }
}
/**
 * 更新菜单
 * @param ctx
 * @returns
 */
export const updateMenu = async (ctx: Context) => {
  const { id } = ctx.params
  if (isNumber(id) && Number(id) > 0) {
    const menuExists = await menuService.getMenuById(Number(id))
    if (!menuExists) {
      ctx.body = formatResponse(null, '菜单不存在', 500)
      return
    }
    const {
      name,
      title,
      icon,
      path,
      type,
      component,
      redirect,
      status,
      parentId,
      keepAlive,
      needLogin,
      link,
    } = ctx.request.body as Prisma.MenuCreateInput & { parentId: number }
    let parent_id = parentId == 0 ? null : parentId
    try {
      const menu = await menuService.updateMenu(
        {
          name,
          icon,
          path,
          component,
          redirect,
          status,
          type,
          title,
          keepAlive,
          needLogin,
          link,
          parentId: parent_id,
        },
        Number(id)
      )
      if (menu) {
        ctx.body = formatResponse(menu, '菜单更新成功')
      } else {
        ctx.body = formatResponse(null, '菜单更新失败')
      }
    } catch (e) {
      ctx.body = formatResponse(e, '菜单更新失败')
    }
  }
}
