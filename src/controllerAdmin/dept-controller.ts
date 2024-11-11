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
import {
  type sDataPermission,
  hasDataPermission,
} from '../middleware/permission'
import redis from '../redis'
import { ADMIN_USER_ID } from '../config'

/**
 * 用户创建部门
 * @param ctx
 */
export const createDept = async (ctx: Context) => {
  try {
    const { id, deptId } = ctx.state.user as sJWT

    const { name, description, status, parentId } = ctx.request
      .body as Prisma.DeptCreateInput & { parentId?: number }
    if (!name) {
      ctx.body = formatResponse(null, '部门名称不能为空', 400)
      return
    }
    if (id !== ADMIN_USER_ID) {
      if (parentId) {
        const dataPerm = await hasDataPermission(ctx, parentId)
        if (!dataPerm) {
          ctx.body = formatResponse({ parentId }, '无权限访问该部门', 403)
          return
        }
      } else {
        ctx.body = formatResponse(null, '父部门不能为空', 400)
        return
      }
    }
    const dept = await deptService.create({
      name,
      description,
      status,
      parentId: parentId || null,
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
  try {
    const { id, deptId } = ctx.state.user as sJWT

    const updatedDeptId = ctx.params.id as string
    if (updatedDeptId) {
      const dataPerm = await hasDataPermission(ctx, updatedDeptId)
      if (!dataPerm) {
        ctx.body = formatResponse(
          { deptId: updatedDeptId },
          '无权限修改该部门',
          403
        )
        return
      }
    }
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
    if (id !== ADMIN_USER_ID) {
      if (parentId) {
        const dataPerm = await hasDataPermission(ctx, parentId)
        if (!dataPerm) {
          ctx.body = formatResponse({ parentId }, '无权限分配该部门', 403)
          return
        }
      } else {
        ctx.body = formatResponse(null, '父部门不能为空', 400)
        return
      }
    }

    const dept = await deptService.update(Number(id), {
      name,
      description,
      status,
      parentId: parentId || null,
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

/**
 * 获取部门树
 * @param ctx
 * @returns
 */
export const getDepts = async (ctx: Context) => {
  try {
    const adminUser = ctx.state.user as sJWT
    const { parentId } = ctx.query as { parentId?: string }
    let targetDeptId: number | null = adminUser.deptId
    let tree: any[] = []
    if (adminUser.id !== ADMIN_USER_ID) {
      if (parentId) {
        const dataPerm = await hasDataPermission(ctx, Number(parentId))
        if (!dataPerm) {
          ctx.body = formatResponse(null, '无权限访问该部门', 403)
          return
        }
        targetDeptId = Number(parentId)
      }
      if (targetDeptId) {
        const dept = await deptService.getDept(targetDeptId)
        if (dept) {
          tree = await deepListToTree([dept], deptService.getDepts)
        } else {
          ctx.body = formatResponse(null, '所属部门不存在', 404)
          return
        }
      }
    } else {
      if (parentId) {
        const dept = await deptService.getDept(Number(parentId))
        if (dept) {
          tree = await deepListToTree([dept], deptService.getDepts)
        } else {
          ctx.body = formatResponse(null, '所属部门不存在', 404)
          return
        }
      } else {
        const depts = await deptService.getDepts(Number(parentId) || null)
        tree = await deepListToTree(depts, deptService.getDepts)
      }
    }

    ctx.body = formatResponse(tree, '获取部门列表成功')
  } catch (e) {
    ctx.body = formatResponse(e, '获取部门列表失败', 500)
  }
}

export const getDept = async (ctx: Context) => {
  try {
    const selectedDeptId = ctx.params.id as string
    if (!selectedDeptId || !isNumber(selectedDeptId)) {
      ctx.body = formatResponse(null, '部门ID不能为空且必须为数字', 400)
      return
    }
    const hasPerm = await hasDataPermission(ctx, selectedDeptId)
    if (!hasPerm) {
      ctx.body = formatResponse(null, '无权限访问该部门', 403)
      return
    }
    const dept = await deptService.getDept(Number(selectedDeptId))
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
  const selectedDeptId = ctx.params.id as string
  if (!selectedDeptId || !isNumber(selectedDeptId)) {
    ctx.body = formatResponse(null, '部门ID不能为空且必须为数字', 400)
    return
  }
  try {
    const hasPerm = await hasDataPermission(ctx, selectedDeptId)
    if (!hasPerm) {
      ctx.body = formatResponse(null, '无权限删除该部门', 403)
      return
    }
    const del = await deptService.delete(Number(selectedDeptId))
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
  const { id, deptId } = ctx.state.user as sJWT
  try {
    if (id !== ADMIN_USER_ID) {
      const dept = await deptService.getDeptById(Number(deptId))
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
