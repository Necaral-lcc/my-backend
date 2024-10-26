/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import { Prisma } from '@prisma/client'
import { isEmail, isPassword, formatResponse } from '@/utils'
import * as jwt from 'jsonwebtoken'
import { SECRET_KEY, TOKEN_KEY, JWT_EXPIRE_TIME } from '@/config'
import type { sJWT } from '@/types'
import adminUserService, {
  sAdminUserCreateParams,
} from '@/serviceAdmin/adminUser-service'
import { hashPassword, comparePassword } from '@/utils/bcrypt'

/**
 * 管理员创建
 * @param ctx
 */
export const registerAdminUser = async (ctx: Context) => {
  const { name, password, email, roleId, deptId } = ctx.request
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

  const result = await adminUserService.create({
    name,
    password: hashPasswordStr,
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
