import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from '../serviceApp/type'
import { formatPageResponse } from '@/utils'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

class RoleService {
  createRootMenu(data: Prisma.MenuCreateInput) {
    const { name, icon, path, component, redirect, status } = data
    return new Promise((resolve, reject) => {
      const menu = prisma.menu.create({
        data: {
          name,
          component,
          parentId: 0,
        },
        select: {
          id: true,
          name: true,
          title: true,
          icon: true,
          component: true,
          redirect: true,
          status: true,
          link: true,
          path: true,
          type: true,
        },
      })
      resolve(menu)
    })
  }
  createMenu(data: Prisma.MenuCreateInput, menuId: number = 0) {
    const { name, icon, path, component, redirect, status, type } = data
    return new Promise((resolve, reject) => {
      const menu = prisma.menu.create({
        data: {
          name,
          icon,
          path,
          component,
          type,
          redirect,
          status,
          parent: {
            connect: {
              id: menuId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          title: true,
          icon: true,
          component: true,
          redirect: true,
          status: true,
          link: true,
          path: true,
          type: true,
        },
      })
      resolve(menu)
    })
  }

  getMenuById(id: number) {
    return new Promise((resolve, reject) => {
      const menu = prisma.menu.findUnique({
        where: {
          id,
          deletedFlag: false,
        },
        include: {
          children: {
            include: {
              children: true,
            },
          },
        },
      })
      resolve(menu)
    })
  }

  getMenuList(params: PageParams) {
    const { page, pageSize } = params
    return new Promise(async (resolve, reject) => {
      const where = {
        deletedFlag: false,
        parentId: 0,
      }
      const count = await prisma.menu.count({
        where,
      })
      if (count === 0) {
        resolve(formatPageResponse([], page, pageSize, count))
        return
      }
      const menus = await prisma.menu.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          title: true,
          icon: true,
          component: true,
          redirect: true,
          status: true,
          link: true,
          path: true,
          type: true,
          children: {
            select: {
              id: true,
              name: true,
              title: true,
              icon: true,
              component: true,
              redirect: true,
              status: true,
              link: true,
              path: true,
              type: true,
            },
          },
        },
      })
      resolve(formatPageResponse(menus, page, pageSize, count))
    })
  }

  getMenuTree() {
    return new Promise(async (resolve, reject) => {
      const menus = await prisma.menu.findMany({
        where: {
          deletedFlag: false,
          status: true,
        },
        select: {
          id: true,
          name: true,
          parentId: true,
        },
      })
      resolve(menus)
    })
  }
}

export default new RoleService()
