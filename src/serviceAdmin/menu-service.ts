import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from '../serviceApp/type'
import { formatPageResponse, sPageResponse } from '@/utils'
import { DefaultArgs } from '@prisma/client/runtime/library'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

class MenuService {
  createMenu(data: Prisma.MenuCreateInput, parentId: number | null = null) {
    const {
      name,
      icon,
      path,
      component,
      redirect,
      status,
      type,
      title,
      keepAlive,
      needLogin,
      link,
      permission,
    } = data
    return new Promise((resolve, reject) => {
      const menu = prisma.menu.upsert({
        where: {
          name,
          deletedFlag: true,
        },
        create: {
          name,
          path,
          title,
          icon,
          component,
          redirect,
          type,
          status,
          keepAlive,
          needLogin,
          link,
          parentId,
          permission,
        },
        update: {
          path,
          title,
          icon,
          component,
          redirect,
          type,
          status,
          keepAlive,
          needLogin,
          link,
          parentId,
          permission,
          deletedFlag: false,
        },
        select: {
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
        },
      })
      resolve(menu)
    })
  }

  getMenuById(id: number): Promise<
    Prisma.Prisma__MenuClient<
      {
        name: string
        title: string | null
        icon: string | null
        path: string | null
        type: number
        component: string | null
        redirect: string | null
        status: boolean
        parentId: number | null
        keepAlive: boolean
        needLogin: boolean
        link: string | null
        id: number
      } | null,
      null,
      DefaultArgs
    >
  > {
    return new Promise((resolve, reject) => {
      const menu = prisma.menu.findUnique({
        where: {
          id,
          deletedFlag: false,
        },
        select: {
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
        },
      })
      resolve(menu)
    })
  }

  getMenuList(): Promise<
    {
      id: number
      name: string
      path: string | null
      title: string | null
      icon: string | null
      component: string | null
      redirect: string | null
      type: number
      status: boolean
      link: string | null
      permission: string | null
      createdAt: Date
      updatedAt: Date
      parentId: number | null
    }[]
  > {
    return new Promise(async (resolve, reject) => {
      const where = {
        deletedFlag: false,
      }

      const menus = await prisma.menu.findMany({
        where,
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
          createdAt: true,
          permission: true,
          updatedAt: true,
          parentId: true,
        },
      })
      resolve(menus)
    })
  }

  getMenuOptions(): Promise<
    {
      title: string | null
      parentId: number | null
      id: number
    }[]
  > {
    return new Promise(async (resolve, reject) => {
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
      resolve(menus)
    })
  }
  getMenuOptionsWithoutBtn(): Promise<
    {
      title: string | null
      parentId: number | null
      id: number
    }[]
  > {
    return new Promise(async (resolve, reject) => {
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
      resolve(menus)
    })
  }

  updateMenu(
    data: Prisma.MenuCreateInput & { parentId: number | null },
    id: number
  ) {
    const {
      name,
      icon,
      path,
      component,
      redirect,
      status,
      type,
      title,
      keepAlive,
      needLogin,
      link,
      parentId,
      permission,
    } = data
    return new Promise((resolve, reject) => {
      const menu = prisma.menu.update({
        where: {
          id,
        },
        data: {
          name,
          path,
          title,
          icon,
          component,
          redirect,
          type,
          status,
          keepAlive,
          needLogin,
          link,
          parentId,
          permission,
        },
        select: {
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
        },
      })
      resolve(menu)
    })
  }

  delete(id: number) {
    return new Promise((resolve, reject) => {
      const menu = prisma.menu.update({
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
      resolve(menu)
    })
  }

  getAdminMenus(): Promise<
    {
      name: string
      icon: string | null
      path: string | null
      component: string | null
      redirect: string | null
      type: number
      title: string | null
      keepAlive: boolean
      needLogin: boolean
      link: string | null
      parentId: number | null
      id: number
    }[]
  > {
    return new Promise(async (resolve, reject) => {
      const menus = await prisma.menu.findMany({
        where: {
          deletedFlag: false,
          status: true,
        },
        select: {
          id: true,
          name: true,
          title: true,
          icon: true,
          component: true,
          redirect: true,
          link: true,
          path: true,
          type: true,
          keepAlive: true,
          needLogin: true,
          parentId: true,
        },
      })
      resolve(menus)
    })
  }
}

export default new MenuService()
