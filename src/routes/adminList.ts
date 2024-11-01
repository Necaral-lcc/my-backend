import {
  createMenu,
  getMenu,
  getMenus,
  getMenuOptions,
  updateMenu,
  deleteMenu,
} from '@/controllerAdmin/menu-controller'
import {
  registerAdminUser,
  loginAdminUser,
  getAdminUsers,
  getAdminUserForm,
  updateAdminUser,
  getAdminUserInfo,
} from '@/controllerAdmin/adminUser-controller'
import {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
  getRoleOptions,
} from '@/controllerAdmin/role-controller'
import { authPermission } from '@/middleware/permission'
import type { IRoute } from './index'
import * as jwt from 'koa-jwt'
import { PORT, ADMIN_SECRET_KEY, APP_SECRET_KEY, TOKEN_KEY } from '@/config'

const list: IRoute[] = [
  {
    name: 'admin-api',
    path: '/admin-api',
    middleware: [
      jwt({
        secret: ADMIN_SECRET_KEY,
        key: 'user',
      }).unless({
        path: [/^\/admin-api\/login/, /^\/admin-api\/register/],
      }),
    ],
    routes: [
      {
        name: 'system',
        path: '/system',
        routes: [
          // 菜单
          {
            path: '/menu',
            type: 'post',
            middleware: [authPermission('system:menu:add')],
            action: createMenu,
          },
          { path: '/menu', type: 'get', action: getMenus },
          {
            path: '/menu/options',
            type: 'get',
            middleware: [authPermission('system:menu:list')],
            action: getMenuOptions,
          },
          {
            path: '/menu/:id',
            type: 'get',
            middleware: [authPermission('system:menu:edit')],
            action: getMenu,
          },
          {
            path: '/menu/:id',
            type: 'put',
            middleware: [authPermission('system:menu:edit')],
            action: updateMenu,
          },
          {
            path: '/menu/:id',
            type: 'delete',
            middleware: [authPermission('system:menu:del')],
            action: deleteMenu,
          },
          // 管理员
          {
            path: '/adminUser',
            type: 'get',
            middleware: [authPermission('system:admin:list')],
            action: getAdminUsers,
          },
          {
            path: '/adminUser/:id',
            type: 'get',
            middleware: [authPermission('system:admin:edit')],
            action: getAdminUserForm,
          },
          {
            path: '/adminUser/:id',
            type: 'put',
            middleware: [authPermission('system:admin:edit')],
            action: updateAdminUser,
          },
          {
            path: '/adminUser',
            type: 'post',
            middleware: [authPermission('system:admin:add')],
            action: registerAdminUser,
          },
          // 角色
          {
            path: '/role',
            type: 'get',
            middleware: [authPermission('system:role:add')],
            action: getRoles,
          },
          {
            path: '/role/options',
            type: 'get',
            middleware: [authPermission('system:role:list')],
            action: getRoleOptions,
          },
          {
            path: '/role/:id',
            type: 'get',
            middleware: [authPermission('system:role:edit')],
            action: getRole,
          },
          {
            path: '/role/:id',
            type: 'put',
            middleware: [authPermission('system:role:edit')],
            action: updateRole,
          },
          {
            path: '/role/:id',
            type: 'delete',
            middleware: [authPermission('system:role:del')],
            action: deleteRole,
          },
          {
            path: '/role',
            type: 'post',
            middleware: [authPermission('system:role:add')],
            action: createRole,
          },
        ],
      },
      {
        name: 'user-info',
        path: '/userInfo',
        type: 'get',
        action: getAdminUserInfo,
      },
      /*{
        name: 'register-admin',
        path: '/register',
        type: 'post',
        action: registerAdminUser,
      }, */
      {
        name: 'login-admin',
        path: '/login',
        type: 'post',
        action: loginAdminUser,
      },
    ],
  },
]

export default list
