import { Prisma, PrismaClient } from '@prisma/client'
import { Context } from 'koa'
import { PageParams } from '../serviceApp/type'
import { formatPageResponse } from '@/utils'
import { DefaultArgs } from '@prisma/client/runtime/library'

/**
 * Service用来处理逻辑，返回结果给Controller
 */

const prisma = new PrismaClient()

class RoleService {
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
    } = data
    return new Promise((resolve, reject) => {
      const menu = prisma.menu.create({
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
        parentId: null,
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

  getMenuTree(): Promise<
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
        },
      })
      resolve(menu)
    })
  }
}

export default new RoleService()
