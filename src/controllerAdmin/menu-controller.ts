/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import menuService from '@/serviceAdmin/menu-service'
import { Prisma } from '@prisma/client'
import { isEmail, isPassword, formatResponse, isNumber } from '@/utils'
import * as jwt from 'jsonwebtoken'
import { TOKEN_KEY, JWT_EXPIRE_TIME } from '@/config'
import { listToTree } from '@/utils/tool'

/**
 * 用户创建权限菜单
 * @param ctx
 */
export const createMenu = async (ctx: Context) => {
  const {
    name,
    path,
    parentId,
    title,
    icon,
    type,
    component,
    redirect,
    status,
    keepAlive,
    needLogin,
    link,
    permission,
  } = ctx.request.body as Omit<Prisma.MenuCreateInput, 'parent'> & {
    parentId: number
  }

  if (name === undefined) {
    ctx.body = formatResponse(null, '请输入菜单名称')
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
        permission,
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

/**
 * 获取菜单列表
 * @description 菜单列表，树形结构，父节点为null转0
 * @param ctx
 */
export const getMenus = async (ctx: Context) => {
  const menus = await menuService.getMenuList()
  if (menus) {
    ctx.body = formatResponse(listToTree(menus, null), '菜单列表获取成功')
  } else {
    ctx.body = formatResponse(null, '菜单列表获取失败')
  }
}

export const getMenuOptions = async (ctx: Context) => {
  const menus = await menuService.getMenuOptions()
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
    permission,
  } = ctx.request.body as Omit<Prisma.MenuCreateInput, 'parent'> & {
    parentId: number
  }
  try {
    if (isNumber(id) && Number(id) > 0) {
      if (!name) {
        ctx.body = formatResponse(null, '请输入菜单名称')
        return
      }
      const menuExists = await menuService.getMenuById(Number(id))
      if (!menuExists) {
        ctx.body = formatResponse(null, '菜单不存在', 500)
        return
      }
      let parent_id = parentId == 0 ? null : parentId
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
          permission,
        },
        Number(id)
      )
      if (menu) {
        ctx.body = formatResponse(menu, '菜单更新成功')
      } else {
        ctx.body = formatResponse(null, '菜单更新失败', 500)
      }
    }
  } catch (e) {
    ctx.body = formatResponse(e, '菜单更新失败', 500)
  }
}

export const deleteMenu = async (ctx: Context) => {
  const { id } = ctx.params
  if (isNumber(id) && Number(id) > 0) {
    try {
      const menuExists = await menuService.getMenuById(Number(id))
      if (!menuExists) {
        ctx.body = formatResponse(null, '菜单不存在', 500)
        return
      }
      const menu = await menuService.delete(Number(id))
      if (menu) {
        ctx.body = formatResponse(null, '菜单删除成功')
      } else {
        ctx.body = formatResponse(null, '菜单删除失败', 500)
      }
    } catch (e) {
      ctx.body = formatResponse(e, '菜单删除失败', 500)
    }
  }
}
