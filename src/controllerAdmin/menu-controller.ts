/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import menuService from '@/serviceAdmin/menu-service'
import { Prisma } from '@prisma/client'
import { isEmail, isPassword, formatResponse } from '@/utils'
import * as jwt from 'jsonwebtoken'
import { SECRET_KEY, TOKEN_KEY, JWT_EXPIRE_TIME } from '@/config'

/**
 * 用户创建权限菜单
 * @param ctx
 */
export const createMenu = async (ctx: Context) => {
  const { id, email } = ctx.state.user
  const { name, icon, path, component, redirect, hidden, parentId } = ctx
    .request.body as Prisma.MenuCreateInput & { parentId: number }
  console.log(name, icon, path, component, redirect, hidden, parentId)

  if (name === undefined) {
    ctx.body = formatResponse(null, '请输入菜单名称')
    return
  }

  if (path === undefined) {
    ctx.body = formatResponse(null, '请输入菜单路径')
    return
  }
  let parent_id = parentId || 0
  const parentMenu = await menuService.getMenuById(parent_id)
  if (parentMenu) {
    const menu = await menuService.createMenu(
      {
        name,
        icon,
        path,
        component,
        redirect,
        hidden,
      },
      parentId
    )
    if (menu) {
      ctx.body = formatResponse(menu, '菜单创建成功')
    } else {
      ctx.body = formatResponse(null, '菜单创建失败')
    }
  } else {
    const menu = await menuService.createRootMenu({
      name,
      icon,
      path,
      component,
      redirect,
      hidden,
    })
    if (menu) {
      ctx.body = formatResponse(menu, '菜单创建成功')
    } else {
      ctx.body = formatResponse(null, '菜单创建失败')
    }
  }
}

export const getMenu = async (ctx: Context) => {
  const { id } = ctx.params
  if (id && id > 0) {
    const menu = await menuService.getMenuById(Number(id))
    if (menu) {
      ctx.body = formatResponse(menu, '菜单获取成功')
    } else {
      ctx.body = formatResponse(null, '菜单获取失败')
    }
  } else {
    ctx.body = formatResponse(null, '请输入菜单id')
  }
}

export const getMenus = async (ctx: Context) => {}
