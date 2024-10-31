import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from '../serviceApp/type'
import { formatPageResponse, sPageResponse } from '@/utils'
import { DefaultArgs } from '@prisma/client/runtime/library'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

const deptSelect: Prisma.DeptSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  parentId: true,
}

class DeptService {
  async upsert({
    id,
    parentId,
    ...data
  }: Omit<Prisma.DeptCreateInput, 'parent'> & {
    id?: number
    parentId?: number | null
  }) {
    const dept = prisma.dept.upsert({
      create: { ...data, parentId },
      update: { ...data, parentId, deletedFlag: false },
      where: { id, deletedFlag: true },
      select: deptSelect,
    })
    return dept
  }

  async update(
    id: number,
    {
      parentId,
      ...data
    }: Omit<Prisma.DeptCreateInput, 'parent'> & {
      parentId?: number | null
    }
  ) {
    const dept = await prisma.dept.update({
      where: { id, deletedFlag: false },
      data: { parentId, ...data },
      select: deptSelect,
    })
    return dept
  }

  async getDepts() {
    const where = { deletedFlag: false }
    const depts = await prisma.dept.findMany({
      where,
      orderBy: { id: 'asc' },
      select: deptSelect,
    })
    return depts
  }

  async getDeptOptions() {
    const depts = await prisma.dept.findMany({
      where: { deletedFlag: false, status: true },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    })
    return depts
  }

  async getDept(id: number) {
    const where = { id, deletedFlag: false }
    const dept = await prisma.dept.findFirst({
      where,
      select: deptSelect,
    })
    return dept
  }

  async delete(id: number) {
    const del = await prisma.dept.update({
      where: { id, deletedFlag: false },
      data: { deletedFlag: true },
      select: deptSelect,
    })
    return del
  }
}

export default new DeptService()
