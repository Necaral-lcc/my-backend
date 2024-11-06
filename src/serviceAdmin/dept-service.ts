import { Prisma, PrismaClient } from '@prisma/client'
import prisma from '../prisma'
import { sList } from 'src/utils/tool'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const deptSelect: Prisma.DeptSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  parentId: true,
}

export interface IDeptList {
  id: number
  name: string
  parentId: number | null
}

class DeptService {
  async create({
    id,
    parentId,
    ...data
  }: Omit<Prisma.DeptCreateInput, 'parent'> & {
    id?: number
    parentId?: number | null
  }) {
    const dept = prisma.dept.create({
      data: { ...data, parentId },
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

  async getDepts(parentId: number | null) {
    const where = { parentId, deletedFlag: false }
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
    const del = await prisma.dept.delete({
      where: { id },
      select: { id: true },
    })
    return del
  }

  async getDeptByParentId(parentId: number | null) {
    const list = await prisma.dept.findMany({
      where: { parentId, deletedFlag: false },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    })
    return list
  }

  async getDeptById(id: number) {
    const dept = await prisma.dept.findUnique({
      where: { id, deletedFlag: false },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    })
    return dept
  }
}

export default new DeptService()
