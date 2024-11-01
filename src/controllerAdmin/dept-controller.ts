/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import deptService from '@/serviceAdmin/dept-service'
import { Prisma } from '@prisma/client'
import { isEmail, isPassword, formatResponse, isNumber } from '@/utils'
import * as jwt from 'jsonwebtoken'
import { TOKEN_KEY, JWT_EXPIRE_TIME } from '@/config'
import { listToTree } from '@/utils/tool'
import PageService from '@/servicePublic/page-service'

/**
 * 用户创建部门
 * @param ctx
 */
export const createDept = async (ctx: Context) => {
  const { name, description, status, parentId } = ctx.request
    .body as Prisma.DeptCreateInput & { parentId?: number }

  if (!name) {
    ctx.body = formatResponse(null, '部门名称不能为空', 400)
    return
  }
  try {
    const dept = await deptService.upsert({
      name,
      description,
      status,
      parentId,
    })
    if (dept) {
      ctx.body = formatResponse(dept, '创建成功')
    } else {
      ctx.body = formatResponse(null, '创建失败', 500)
    }
  } catch (e) {
    ctx.body = formatResponse(e, '创建失败', 500)
  }
}
/**
 * 用户更新部门
 * @param ctx
 */
export const updateDept = async (ctx: Context) => {
  const id = ctx.params.id as string
  const { name, description, status, parentId } = ctx.request
    .body as Prisma.DeptCreateInput & { parentId?: number }
  if (!id || isNumber(id)) {
    ctx.body = formatResponse(null, '部门ID不能为空且必须为数字', 400)
    return
  }
  if (!name) {
    ctx.body = formatResponse(null, '部门名称不能为空', 400)
    return
  }
  try {
    const dept = await deptService.update(Number(id), {
      name,
      description,
      status,
      parentId,
    })
    if (dept) {
      ctx.body = formatResponse(dept, '更新成功')
    } else {
      ctx.body = formatResponse(null, '更新失败', 500)
    }
  } catch (e) {
    ctx.body = formatResponse(e, '更新失败', 500)
  }
}

export const getDepts = async (ctx: Context) => {
  try {
    const { page, pageSize } = await PageService.isPage(ctx)
    const depts = await deptService.getDepts()
    ctx.body = formatResponse(listToTree(depts, null), '获取部门列表成功')
  } catch (e) {
    ctx.body = formatResponse(e, '获取部门列表失败', 500)
  }
}

export const getDeptOptions = async (ctx: Context) => {
  try {
    const depts = await deptService.getDeptOptions()
    ctx.body = formatResponse(depts, '获取部门选项成功')
  } catch (e) {
    ctx.body = formatResponse(e, '获取部门选项失败', 500)
  }
}

export const getDept = async (ctx: Context) => {
  const { id } = ctx.params
  if (!id || isNumber(id)) {
    ctx.body = formatResponse(null, '部门ID不能为空且必须为数字', 400)
    return
  }
  try {
    const dept = await deptService.getDept(id)
    if (dept) {
      ctx.body = formatResponse(dept, '获取部门成功')
    } else {
      ctx.body = formatResponse(null, '获取部门失败', 404)
    }
  } catch (e) {
    ctx.body = formatResponse(e, '获取部门失败', 500)
  }
}

export const deleteDept = async (ctx: Context) => {
  const { id } = ctx.params
  if (!id || isNumber(id)) {
    ctx.body = formatResponse(null, '部门ID不能为空且必须为数字', 400)
    return
  }
  try {
    const del = await deptService.delete(id)
    if (del) {
      ctx.body = formatResponse(null, '删除部门成功')
    } else {
      ctx.body = formatResponse(null, '删除部门失败', 404)
    }
  } catch (e) {
    ctx.body = formatResponse(e, '删除部门失败', 500)
  }
}
