import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from '../serviceApp/type'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

class RoleService {
  createRootMenu(data: Prisma.MenuCreateInput) {
    const { name, icon, path, component, redirect, hidden } = data
    return new Promise((resolve, reject) => {
      const menu = prisma.menu.create({
        data: {
          name,
          parentId: null,
        },
        include: {
          children: true,
        },
      })
      resolve(menu)
    })
  }
  createMenu(data: Prisma.MenuCreateInput, menuId: number = 0) {
    const { name, icon, path, component, redirect, hidden } = data
    return new Promise((resolve, reject) => {
      const menu = prisma.menu.create({
        data: {
          name,
          icon,
          path,
          component,
          redirect,
          hidden,
          parent: {
            connect: {
              id: menuId,
            },
          },
        },

        include: {
          children: true,
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
}

export default new RoleService()
