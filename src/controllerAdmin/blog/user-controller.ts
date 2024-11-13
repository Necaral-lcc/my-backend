import { type sPrismaDept } from '@src/middleware/permission'
/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import userService from '@src/serviceAdmin/blog/user-service'
import { Prisma } from '@prisma/client'
import { isEmail, isPassword, formatResponse, isNumber } from '@src/utils'
import { sJWT } from '@src/types'
import { hashPassword } from '@src/utils/bcrypt'
import { hasDataPermission } from '@src/middleware/permission'
import { ADMIN_USER_ID } from '@src/config'
import PageService from '@src/servicePublic/page-service'

/**
 * 创建用户
 * @param ctx
 * @returns
 */
export const createUser = async (ctx: Context) => {
  try {
    const adminUser = ctx.state.user as sJWT
    const { email, password, name, deptId } = ctx.request
      .body as Prisma.UserCreateInput & { deptId?: number }
    if (!email) {
      ctx.body = formatResponse(null, '邮箱不能为空', 400)
      return
    }
    if (!isEmail(email)) {
      ctx.body = formatResponse(null, '邮箱格式不正确', 400)
      return
    }
    if (!password || !isPassword(password)) {
      ctx.body = formatResponse(null, '密码格式不正确', 400)
      return
    }
    if (adminUser.id !== ADMIN_USER_ID && deptId) {
      const hasPerm = await hasDataPermission(ctx, deptId)
      if (!hasPerm) {
        ctx.body = formatResponse({ deptId }, '无权限分配此部门给用户', 403)
        return
      }
    }
    const repeatUser = await userService.findUnique(email)
    if (repeatUser) {
      ctx.body = formatResponse(null, '邮箱已存在', 400)
      return
    }
    let hashPasswordStr: string | undefined = undefined
    try {
      hashPasswordStr = await hashPassword(password)
    } catch (err) {
      ctx.body = formatResponse(err, '密码加密错误', 400)
      return
    }
    const newUser = await userService.create({
      email,
      password: hashPasswordStr,
      name,
      deptId,
    })
    ctx.body = formatResponse(newUser, '创建成功')
  } catch (err) {
    ctx.body = formatResponse(err, '创建错误', 400)
  }
}
/**
 * 更新用户信息
 * @param ctx
 * @returns
 */
export const updateUser = async (ctx: Context) => {
  try {
    const adminUser = ctx.state.user as sJWT
    const depts = ctx.state.dataPermission.depts as sPrismaDept[]
    const id = ctx.params.id as string
    const { email, password, name, deptId } = ctx.request.body as {
      email?: string
      password?: string
      name?: string
      deptId?: number
    }
    if (!id || !isNumber(id)) {
      ctx.body = formatResponse({ id }, 'id必须为数字', 400)
      return
    }
    if (email) {
      const repeatUser = await userService.getUserEmailRepeat({
        email,
        id: Number(id),
      })
      if (repeatUser) {
        ctx.body = formatResponse(null, '邮箱已存在', 400)
        return
      }
    }
    if (password) {
      if (!isPassword(password)) {
        ctx.body = formatResponse(null, '密码格式不正确', 400)
        return
      }
    }

    const userExist = await userService.getUserByIdUnderDepts(Number(id), depts)
    if (!userExist) {
      ctx.body = formatResponse(null, '用户不存在', 404)
      return
    }
    if (adminUser.id !== ADMIN_USER_ID) {
      if (userExist.deptId) {
        const hasPerm = await hasDataPermission(ctx, userExist.deptId)
        if (!hasPerm) {
          ctx.body = formatResponse({ deptId }, '无权限修改此用户', 403)
          return
        }
      }
      if (deptId) {
        const hasPerm = await hasDataPermission(ctx, deptId)
        if (!hasPerm) {
          ctx.body = formatResponse({ deptId }, '无权限分配此部门给用户', 403)
          return
        }
      }
    }
    let hashPasswordStr: string | undefined = undefined
    if (password) {
      try {
        hashPasswordStr = await hashPassword(password)
      } catch (err) {
        ctx.body = formatResponse(err, '密码加密错误', 400)
        return
      }
    }
    const updatedUser = await userService.update(Number(id), {
      email,
      password: hashPasswordStr,
      name,
      deptId,
    })
    ctx.body = formatResponse(updatedUser, '更新成功')
  } catch (err) {
    ctx.body = formatResponse(err, '更新错误', 400)
  }
}
/**
 * 删除用户
 * @param ctx
 * @returns
 */
export const deleteUser = async (ctx: Context) => {
  try {
    const adminUser = ctx.state.user as sJWT
    let depts = ctx.state.dataPermission.depts as sPrismaDept[]
    const { id } = ctx.params

    const userExist = await userService.getUserByIdUnderDepts(id, depts)
    if (!userExist) {
      ctx.body = formatResponse(null, '用户不存在', 404)
      return
    }
    if (adminUser.id !== ADMIN_USER_ID) {
      if (userExist.deptId) {
        const hasPerm = await hasDataPermission(ctx, userExist.deptId)
        if (!hasPerm) {
          ctx.body = formatResponse(
            { id: userExist.id },
            '无权限删除此用户',
            403
          )
          return
        }
      }
    }
    await userService.delete(id)
    ctx.body = formatResponse(null, '删除成功')
  } catch (err) {
    ctx.body = formatResponse(err, '删除错误', 400)
  }
}

/**
 * 获取用户列表
 * @param ctx
 * @returns
 */
export const getUserList = async (ctx: Context) => {
  try {
    const adminUser = ctx.state.user as sJWT
    const depts = ctx.state.dataPermission.depts as sPrismaDept[]
    const pager = await PageService.isPage(ctx)
    const { page, pageSize, name, email, deptId } = pager
    if (adminUser.id !== ADMIN_USER_ID) {
      if (deptId) {
        const hasPerm = await hasDataPermission(ctx, deptId)
        if (!hasPerm) {
          ctx.body = formatResponse({ deptId }, '无权限获取此部门用户', 403)
          return
        }
      }
    }
    const where = {
      AND: [],
    } as Prisma.UserWhereInput
    if (name) {
      where.AND = { ...where.AND, name: { contains: name } }
    }
    if (email) {
      where.AND = { ...where.AND, email: { contains: email } }
    }
    console.log('deptIds', depts)

    if (adminUser.id !== ADMIN_USER_ID) {
      if (deptId) {
        where.AND = { ...where.AND, deptId: deptId }
      } else {
        where.OR = depts.map((dept) => ({ deptId: dept.id }))
      }
    }
    const userList = await userService.getUserList(where, { page, pageSize })
    ctx.body = formatResponse(userList, '获取成功')
  } catch (err) {
    ctx.body = formatResponse(err, '获取错误', 400)
  }
}

/**
 * 获取用户详情
 * @param ctx
 * @returns
 */
export const getUserDetail = async (ctx: Context) => {
  try {
    const adminUser = ctx.state.user as sJWT
    const depts = ctx.state.dataPermission.depts as sPrismaDept[]
    const id = ctx.params.id as string
    console.log('user.id', id)
    const intInt = parseInt(id)
    if (!intInt) {
      ctx.body = formatResponse(null, '参数错误', 400)
      return
    }
    const userExist = await userService.getUserByIdUnderDepts(intInt, depts)
    if (!userExist) {
      ctx.body = formatResponse(null, '用户不存在', 404)
      return
    }
    ctx.body = formatResponse(userExist, '获取成功')
  } catch (err) {
    ctx.body = formatResponse(err, '获取错误', 400)
  }
}
