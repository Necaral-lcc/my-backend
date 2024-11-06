/**
 * Controller用于接受数据、返回数据给前端
 */
import { Context } from 'koa'
import deptService, { type IDeptList } from '../serviceAdmin/dept-service'
import { Prisma } from '@prisma/client'
import { isEmail, isPassword, formatResponse, isNumber } from '../utils'
import * as jwt from 'jsonwebtoken'
import { ITree, deepListToTree } from '../utils/tool'
import PageService from '../servicePublic/page-service'
import { sJWT } from '../types'
import adminUserService from '../serviceAdmin/adminUser-service'

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
    const parent_id = parentId || undefined
    const dept = await deptService.create({
      name,
      description,
      status,
      parentId: parent_id,
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
  if (!id || !isNumber(id)) {
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
  const { parentId } = ctx.query as { parentId?: string }
  try {
    const depts = await deptService.getDepts(Number(parentId) || null)
    const tree = await deepListToTree(depts, deptService.getDepts)
    ctx.body = formatResponse(tree, '获取部门列表成功')
  } catch (e) {
    ctx.body = formatResponse(e, '获取部门列表失败', 500)
  }
}

export const getDeptOptions = async (ctx: Context) => {
  try {
    const depts = await deptService.getDeptOptions()
    if (depts) {
      depts.forEach((item) => {
        if (!item.parentId) item.parentId = 0
      })
      ctx.body = formatResponse(depts, '获取部门选项成功')
    } else {
      ctx.body = formatResponse(null, '获取部门选项失败', 404)
    }
  } catch (e) {
    ctx.body = formatResponse(e, '获取部门选项失败', 500)
  }
}

export const getDept = async (ctx: Context) => {
  const id = ctx.params.id as string
  if (!id || !isNumber(id)) {
    ctx.body = formatResponse(null, '部门ID不能为空且必须为数字', 400)
    return
  }
  try {
    const dept = await deptService.getDept(Number(id))
    if (dept) {
      if (!dept.parentId) dept.parentId = 0
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
  if (!id || !isNumber(id)) {
    ctx.body = formatResponse(null, '部门ID不能为空且必须为数字', 400)
    return
  }
  try {
    const del = await deptService.delete(id)
    if (del) {
      ctx.body = formatResponse(del, '删除部门成功')
    } else {
      ctx.body = formatResponse(null, '删除部门失败', 404)
    }
  } catch (e) {
    ctx.body = formatResponse(e, '删除部门失败', 500)
  }
}

export const getDeptTree = async (ctx: Context) => {
  const { id } = ctx.state.user as sJWT
  let deptId: number | null = null
  try {
    if (id !== 1) {
      const adminUser = await adminUserService.getById(id)
      if (adminUser) {
        deptId = adminUser.deptId
      }
      if (deptId) {
        const dept = await deptService.getDeptById(deptId)
        if (dept) {
          const deptChildren = await deepListToTree(
            [dept],
            deptService.getDeptByParentId
          )
          ctx.body = formatResponse(deptChildren, '获取部门树成功')
        } else {
          ctx.body = formatResponse(null, '所属部门不存在', 404)
        }
      } else {
        ctx.body = formatResponse({ deptId }, '部门id不能为空', 500)
      }
    } else {
      const depts = await deptService.getDeptByParentId(null)
      const deptChildren = await deepListToTree(
        depts,
        deptService.getDeptByParentId
      )
      ctx.body = formatResponse(deptChildren, '获取部门树成功')
    }
  } catch (e) {
    ctx.body = formatResponse(e, '获取部门选项失败', 500)
  }
}
