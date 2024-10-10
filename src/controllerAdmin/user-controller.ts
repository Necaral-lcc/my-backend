/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import userService from '@/serviceAdmin/user-service'
import { Prisma } from '@prisma/client'
import { isEmail, isPassword, formatResponse } from '@/utils'
import * as jwt from 'jsonwebtoken'
import { SECRET_KEY, TOKEN_KEY, JWT_EXPIRE_TIME } from '@/config'

/**
 * 返回指定用户信息
 * @param ctx
 */
export const getUser = async (ctx: Context) => {
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

/**
 * 返回用户列表
 * @param ctx
 */
export const getUsers = async (ctx: Context) => {
  const page = Number(ctx.query.page) || 1
  const pageSize = Number(ctx.query.pageSize) || 10
  const order = (ctx.query.order || 'id') as string
  const orderBy = (ctx.query.orderBy || 'desc') as Prisma.SortOrder
  const res = await userService.list({ page, pageSize, order, orderBy })
  ctx.body = formatResponse(res)
}

/**
 * 接收post请求，并创建用户
 * 如：/info?name=jack&age=32
 * ctx.query => { name: 'jack', age: '32' }
 * @param ctx
 */
export const createUser = async (ctx: Context) => {
  const { email, password } = ctx.request.body as {
    email: string
    password: string
  }
  if (!email) ctx.throw(400, '邮箱不能为空')
  if (!isEmail(email)) ctx.throw(400, '邮箱格式不正确')
  if (!password) ctx.throw(400, '密码不能为空')
  if (password.length < 6) ctx.throw(400, '密码长度不能少于6位')
  if (password.length > 20) ctx.throw(400, '密码长度不能超过20位')
  if (!isPassword(password)) ctx.throw(400, '密码格式不正确')
  const user = await userService.getByEmail(email)
  if (user) {
    ctx.body = formatResponse(null, '邮箱已存在', 400)
    return
  }
  const res = await userService.create(email, password)
  console.log('createUser', res)
  ctx.response.type = 'application/json'
  ctx.body = formatResponse(res, '创建成功', 200)
}

/**
 * 接收put请求，并修改对应用户
 * @param ctx
 */
export const updateUser = async (ctx: Context) => {
  const { id } = ctx.params
  if (!id) ctx.body = formatResponse(null, 'id不能为空', 400)
  const data = ctx.request.body as Prisma.UserUpdateInput
  if (!data || Object.keys(data).length === 0) ctx.throw(400, '数据不能为空')
  const res = await userService.update(id, data)
  ctx.body = formatResponse(res, '修改成功', 200)
}

/**
 * 接收delete请求，并删除对应用户
 * @param ctx
 */
export const deleteUser = async (ctx: Context) => {
  const { id } = ctx.params
  if (!id) ctx.body = formatResponse(null, 'id不能为空', 400)
  if (id > 0) {
    const user = await userService.get(Number(id))
    if (!user) {
      ctx.body = formatResponse(null, '用户不存在', 404)
      return
    }
    const res = await userService.delete(id)
    ctx.body = formatResponse(null, '删除成功', 200)
  } else {
    ctx.body = formatResponse(null, 'id非法', 400)
  }
}

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

export const deleteSelf = async (ctx: Context) => {
  const { id } = ctx.state.user
  const res = await userService.deleteSelf(id)
  ctx.body = formatResponse(null, '注销成功', 200)
}
