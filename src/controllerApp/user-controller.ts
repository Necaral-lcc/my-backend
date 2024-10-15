/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import userService from '@/serviceApp/user-service'
import { Prisma } from '@prisma/client'
import { isEmail, isPassword, formatResponse } from '@/utils'
import * as jwt from 'jsonwebtoken'
import { SECRET_KEY, TOKEN_KEY, JWT_EXPIRE_TIME } from '@/config'
import type { sJWT } from '@/types'

/**
 * 用户注销
 * @param ctx
 */
export const registerUser = async (ctx: Context) => {
  const { email, password } = ctx.request.body as {
    email: string
    password: string
  }
  if (!email) ctx.body = formatResponse(null, '邮箱不能为空', 400)
  if (!isEmail(email)) ctx.body = formatResponse(null, '邮箱格式不正确', 400)
  if (!password) ctx.body = formatResponse(null, '密码不能为空', 400)
  if (password.length < 6)
    ctx.body = formatResponse(null, '密码长度不能少于6位', 400)
  if (password.length > 20)
    ctx.body = formatResponse(null, '密码长度不能超过20位', 400)
  if (!isPassword(password))
    ctx.body = formatResponse(null, '密码格式不正确', 400)
  const user = await userService.getByEmail(email)
  if (user) {
    ctx.body = formatResponse(null, '邮箱已存在', 400)
  } else {
    const user = await userService.getByEmailDeleted(email)
    if (user) {
      const res = await userService.restore(email, password)
      ctx.body = formatResponse(res, '注册成功', 200)
    } else {
      const res = await userService.create(email, password)
      ctx.body = formatResponse(res, '注册成功', 200)
    }
  }
}

/**
 * 用户登录
 * @param ctx
 */
export const login = async (ctx: Context) => {
  const { email, password } = ctx.request.body as {
    email: string
    password: string
  }
  if (!email) ctx.body = formatResponse(null, '邮箱不能为空', 400)
  if (!isEmail(email)) ctx.body = formatResponse(null, '邮箱格式不正确', 400)
  if (!password) ctx.body = formatResponse(null, '密码不能为空', 400)
  const res = await userService.login(email, password)

  if (res) {
    const { id, email } = res as { id: number; email: string }
    const token = jwt.sign({ id, email }, SECRET_KEY, {
      expiresIn: JWT_EXPIRE_TIME,
    })
    ctx.response.set(TOKEN_KEY, token)
    ctx.body = formatResponse(res, '登录成功', 200)
  } else {
    ctx.body = formatResponse(null, '用户名或密码错误', 401)
  }
}

/**
 * 返回用户自己信息
 * @param ctx
 */
export const getUser = async (ctx: Context) => {
  const { id } = ctx.state.user as sJWT
  if (id > 0) {
    const res = await userService.get(Number(id))
    if (res) {
      ctx.body = formatResponse(res)
    } else {
      ctx.body = formatResponse(null, '用户不存在', 404)
    }
  } else {
    ctx.body = formatResponse(null, 'id不能为空', 400)
  }
}

/**
 * 接收put请求，并修改对应用户
 * @param ctx
 */
export const updateSelf = async (ctx: Context) => {
  const { id } = ctx.state.user as sJWT
  const data = ctx.request.body as Prisma.UserUpdateInput
  if (!data || Object.keys(data).length === 0)
    ctx.body = formatResponse(null, '数据不能为空', 400)
  const user = await userService.get(Number(id))
  if (!user) {
    ctx.body = formatResponse(null, '用户不存在', 404)
    return
  }
  const res = await userService.update(id, data)
  ctx.body = formatResponse(res, '修改成功', 200)
}

/**
 * 用户注销
 * @param ctx
 */
export const deleteSelf = async (ctx: Context) => {
  const { id } = ctx.state.user as sJWT
  const user = await userService.get(Number(id))
  if (!user) {
    ctx.body = formatResponse(null, '用户不存在', 404)
    return
  }
  const res = await userService.deleteSelf(id)

  ctx.body = formatResponse(res, '注销成功', 200)
}

/**
 * 返回指定用户信息
 * @param ctx
 */
export const viewUser = async (ctx: Context) => {
  const { id } = ctx.params
  ctx.response.type = 'application/json'

  if (id > 0) {
    const res = await userService.get(Number(id))
    if (res) {
      ctx.body = formatResponse(res)
    } else {
      ctx.body = formatResponse(null, '用户不存在', 404)
    }
  } else {
    ctx.body = formatResponse(null, 'id不能为空', 400)
  }
}
