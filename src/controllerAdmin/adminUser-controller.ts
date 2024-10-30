/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import { isEmail, isPassword, formatResponse } from '@/utils'
import * as jwt from 'jsonwebtoken'
import { SECRET_KEY, TOKEN_KEY, JWT_EXPIRE_TIME } from '@/config'
import adminUserService, {
  sAdminUserCreateParams,
} from '@/serviceAdmin/adminUser-service'
import { hashPassword, comparePassword } from '@/utils/bcrypt'
import { sJWT } from '@/types'
import { sAdminUserInfo } from './type'
import menuService from '@/serviceAdmin/menu-service'

/**
 * 管理员创建
 * @param ctx
 */
export const registerAdminUser = async (ctx: Context) => {
  const { name, password, email, roleId, deptId, nickname } = ctx.request
    .body as sAdminUserCreateParams
  if (!name || !password) {
    ctx.body = formatResponse(null, '用户名或密码不能为空', 400)
    return
  }
  if (!isPassword(password)) {
    ctx.body = formatResponse(null, '密码格式不正确', 400)
    return
  }
  if (email && !isEmail(email)) {
    ctx.body = formatResponse(null, '邮箱格式不正确', 400)
    return
  }
  let hashPasswordStr = ''
  try {
    hashPasswordStr = await hashPassword(password)
  } catch (error) {
    ctx.body = formatResponse(null, '密码格式错误', 500)
    return
  }
  const repeat = await adminUserService.findUnique(name)
  if (repeat) {
    ctx.body = formatResponse(null, '用户名已存在', 400)
    return
  }

  const result = await adminUserService.upsert({
    name,
    password: hashPasswordStr,
    nickname,
    email,
    roleId,
    deptId,
  })
  if (result) {
    ctx.body = formatResponse(result, '创建成功')
  } else {
    ctx.body = formatResponse(null, '创建失败', 500)
  }
}

export const loginAdminUser = async (ctx: Context) => {
  const { username, password } = ctx.request.body as {
    username: string
    password: string
  }
  if (!username || !password) {
    ctx.body = formatResponse(null, '用户名或密码不能为空', 400)
    return
  }
  const user = await adminUserService.findUnique(username)
  if (!user) {
    ctx.body = formatResponse(null, '用户名或密码错误', 400)
    return
  }
  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) {
    ctx.body = formatResponse(null, '用户名或密码错误', 400)
    return
  }
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: JWT_EXPIRE_TIME,
  })
  ctx.response.set(TOKEN_KEY, token)
  ctx.body = formatResponse(null, '登录成功')
}

type sGetAdminUsersParams = Record<'page' | 'pageSize', string> & {
  name?: string
  email?: string
}

export const getAdminUsers = async (ctx: Context) => {
  const params = ctx.query as unknown as sGetAdminUsersParams
  const { page, pageSize, name, email } = params

  if (Number(page) <= 0) {
    ctx.body = formatResponse(null, 'page参数必须大于0', 400)
    return
  }
  if (Number(pageSize) < 1) {
    ctx.body = formatResponse(null, 'pageSize参数必须大于1', 400)
    return
  }

  const list = await adminUserService.list({
    page: Number(page),
    pageSize: Number(pageSize),
    name,
    email,
  })

  if (list) {
    ctx.body = formatResponse(list, '获取成功')
  } else {
    ctx.body = formatResponse(null, '获取失败', 500)
  }
}

export const getAdminUserForm = async (ctx: Context) => {
  const id = ctx.params.id as string
  if (!id || !Number(id)) {
    ctx.body = formatResponse(null, 'id不能为空', 400)
    return
  }
  try {
    const adminUser = await adminUserService.formDetail(Number(id))
    if (adminUser) {
      ctx.body = formatResponse(adminUser, '获取成功')
    } else {
      ctx.body = formatResponse(null, '获取失败', 500)
    }
  } catch (error) {
    ctx.body = formatResponse(error, '获取失败', 500)
  }
}
export const getAdminUser = async (ctx: Context) => {
  const id = ctx.params.id as string
  if (!id || !Number(id)) {
    ctx.body = formatResponse(null, 'id不能为空', 400)
    return
  }
  try {
    const adminUser = await adminUserService.detail(Number(id))
    if (adminUser) {
      ctx.body = formatResponse(adminUser, '获取成功')
    } else {
      ctx.body = formatResponse(null, '获取失败', 500)
    }
  } catch (error) {
    ctx.body = formatResponse(error, '获取失败', 500)
  }
}

export const updateAdminUser = async (ctx: Context) => {
  const id = ctx.params.id as string
  const { name, password, email, roleId, deptId, nickname, status } = ctx
    .request.body as sAdminUserCreateParams
  if (!id || !Number(id)) {
    ctx.body = formatResponse(null, 'id不能为空', 400)
    return
  }
  try {
    const repeat = await adminUserService.getById(Number(id))
    if (!repeat) {
      ctx.body = formatResponse(null, '用户已存在', 400)
      return
    }
    if (password && !isPassword(password)) {
      ctx.body = formatResponse(null, '密码格式不正确', 400)
      return
    }
    if (email && !isEmail(email)) {
      ctx.body = formatResponse(null, '邮箱格式不正确', 400)
      return
    }

    let hashPasswordStr = undefined
    try {
      if (password) {
        hashPasswordStr = await hashPassword(password)
      }
    } catch (error) {
      ctx.body = formatResponse(null, '密码格式错误', 500)
      return
    }

    const result = await adminUserService.update(Number(id), {
      name,
      nickname,
      email,
      roleId,
      deptId,
      status,
      password: hashPasswordStr,
    })
    if (result) {
      ctx.body = formatResponse(result, '创建成功')
    } else {
      ctx.body = formatResponse(null, '创建失败', 500)
    }
  } catch (error) {
    ctx.body = formatResponse(error, '更新失败', 500)
  }
}

export const deleteAdminUser = async (ctx: Context) => {
  const id = ctx.params.id as string
  if (!id || !Number(id)) {
    ctx.body = formatResponse(null, 'id不能为空', 400)
    return
  }
  try {
    const result = await adminUserService.delete(Number(id))
    if (result) {
      ctx.body = formatResponse(null, '删除成功')
    } else {
      ctx.body = formatResponse(null, '删除失败', 500)
    }
  } catch (error) {
    ctx.body = formatResponse(error, '删除失败', 500)
  }
}

export const getAdminUserInfo = async (ctx: Context) => {
  const { id } = ctx.state.user as sJWT
  const user: Partial<sAdminUserInfo> = {}
  try {
    const adminUser = await adminUserService.getAdminUserInfo(id)
    if (adminUser) {
      user.info = adminUser
    } else {
      ctx.body = formatResponse(null, '获取失败', 500)
      return
    }
    if (id === 1) {
      user.permission = ['*:*:*']
      const routes = await menuService.getAdminMenus()
      user.routes = routes
      ctx.body = formatResponse(user, '获取成功')
      return
    } else {
      const userRouteRes = await adminUserService.getAdminUserRoutes(id)
      if (userRouteRes) {
        const userRoutes =
          userRouteRes?.role?.menuOnRole.map((item) => {
            return item.menu
          }) || []
        user.routes = userRoutes
          .filter((item) => item.type != 4)
          .map((item) => ({
            ...item,
            parentId: item.parentId || 0,
          }))
        user.permission = userRoutes.reduce((acc, cur) => {
          if (cur.permission) {
            return acc.concat(cur.permission)
          } else {
            return acc
          }
        }, [] as string[])
      } else {
        ctx.body = formatResponse(null, '获取失败', 500)
        return
      }
    }

    ctx.body = formatResponse(user, '获取成功')
  } catch (error) {
    ctx.body = formatResponse(error, '获取失败', 500)
  }
}
