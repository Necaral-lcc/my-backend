import { Prisma, PrismaClient } from '@prisma/client'
import prisma from '../prisma'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const menuSelect: Prisma.MenuSelect = {
  id: true,
  name: true,
  path: true,
  title: true,
  icon: true,
  component: true,
  redirect: true,
  type: true,
  status: true,
  keepAlive: true,
  needLogin: true,
  link: true,
  parentId: true,
  permission: true,
}

class MenuService {
  async createMenu(
    data: Omit<Prisma.MenuCreateInput, 'parent'>,
    parentId: number | null = null
  ) {
    const menu = await prisma.menu.upsert({
      where: {
        name: data.name,
        deletedFlag: true,
      },
      create: {
        ...data,
        parentId,
      },
      update: {
        ...data,
        parentId,
        deletedFlag: false,
      },
      select: menuSelect,
    })
    return menu
  }

  async getMenuById(id: number) {
    const menu = await prisma.menu.findUnique({
      where: {
        id,
        deletedFlag: false,
      },
      select: menuSelect,
    })
    return menu
  }

  async getMenuList() {
    const where = {
      deletedFlag: false,
    }
    const menus = await prisma.menu.findMany({
      where,
      select: menuSelect,
    })
    return menus
  }

  async getMenuOptions() {
    const menus = await prisma.menu.findMany({
      where: {
        deletedFlag: false,
        status: true,
      },
      select: {
        id: true,
        title: true,
        parentId: true,
      },
    })
    return menus
  }
  async getMenuOptionsWithoutBtn() {
    const menus = await prisma.menu.findMany({
      where: {
        OR: [
          {
            deletedFlag: false,
            status: true,
          },
        ],
        NOT: {
          type: 3,
        },
      },
      select: {
        id: true,
        title: true,
        parentId: true,
      },
    })
    return menus
  }

  updateMenu(
    data: Omit<Prisma.MenuCreateInput, 'parent'> & { parentId: number | null },
    id: number
  ) {
    const menu = prisma.menu.update({
      where: {
        id,
      },
      data,
      select: menuSelect,
    })
    return menu
  }

  async delete(id: number) {
    const menu = await prisma.menu.update({
      where: {
        id,
      },
      data: {
        deletedFlag: true,
      },
      select: {
        id: true,
        name: true,
      },
    })
    return menu
  }

  async getAdminMenus() {
    const menus = await prisma.menu.findMany({
      where: {
        OR: [{ deletedFlag: false, status: true }],
        NOT: { type: 4 },
      },
      select: menuSelect,
    })
    return menus
  }
}

export default new MenuService()
