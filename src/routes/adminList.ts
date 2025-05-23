import {
  createMenu,
  getMenu,
  getMenus,
  getMenuOptions,
  updateMenu,
  deleteMenu,
  getMenuTreeOptions,
} from '../controllerAdmin/system/menu-controller'
import {
  registerAdminUser,
  loginAdminUser,
  getAdminUsers,
  getAdminUserForm,
  updateAdminUser,
  getAdminUserInfo,
} from '../controllerAdmin/system/adminUser-controller'
import {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
  getRoleOptions,
} from '../controllerAdmin/system/role-controller'
import {
  createDept,
  updateDept,
  getDept,
  getDepts,
  deleteDept,
  getDeptTree,
} from '../controllerAdmin/system/dept-controller'
import { authPermission, dataPermission } from '../middleware/permission'
import type { IRoute } from './index'
import * as jwt from 'koa-jwt'
import { PORT, ADMIN_SECRET_KEY, APP_SECRET_KEY, TOKEN_KEY } from '../config'
import { rateLimit } from '../middleware/rateLimit'
import { refreshToken } from '../middleware/token'
import { cache } from '../middleware/cache'
import {
  createUser,
  updateUser,
  deleteUser,
  getUserList,
  getUserDetail,
} from '../controllerAdmin/blog/user-controller'

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
      refreshToken(),
      rateLimit(),
      cache(),
      dataPermission(),
    ],
    routes: [
      {
        name: 'system',
        path: '/system',
        middleware: [],
        routes: [
          // 菜单
          {
            name: 'menu',
            path: '/menu',
            middleware: [],
            routes: [
              {
                path: '',
                type: 'post',
                middleware: [authPermission('system:menu:add')],
                action: createMenu,
              },
              { path: '', type: 'get', action: getMenus },
              {
                path: '/options',
                type: 'get',
                middleware: [authPermission('system:menu:list')],
                action: getMenuOptions,
              },
              {
                path: '/tree',
                type: 'get',
                middleware: [authPermission('system:menu:list')],
                action: getMenuTreeOptions,
              },
              {
                path: '/:id',
                type: 'get',
                middleware: [authPermission('system:menu:detail')],
                action: getMenu,
              },
              {
                path: '/:id',
                type: 'put',
                middleware: [authPermission('system:menu:edit')],
                action: updateMenu,
              },
              {
                path: '/:id',
                type: 'delete',
                middleware: [authPermission('system:menu:del')],
                action: deleteMenu,
              },
            ],
          },
          // 管理员
          {
            name: 'admin-user',
            path: '/adminUser',
            middleware: [],
            routes: [
              {
                path: '',
                type: 'get',
                middleware: [authPermission('system:admin:list')],
                action: getAdminUsers,
              },
              {
                path: '/:id',
                type: 'get',
                middleware: [authPermission('system:admin:detail')],
                action: getAdminUserForm,
              },
              {
                path: '/:id',
                type: 'put',
                middleware: [authPermission('system:admin:edit')],
                action: updateAdminUser,
              },
              {
                path: '',
                type: 'post',
                middleware: [authPermission('system:admin:add')],
                action: registerAdminUser,
              },
            ],
          },
          // 角色
          {
            name: 'role',
            path: '/role',
            middleware: [],
            routes: [
              {
                path: '',
                type: 'get',
                middleware: [authPermission('system:role:list')],
                action: getRoles,
              },
              {
                path: '/options',
                type: 'get',
                middleware: [authPermission('system:role:options')],
                action: getRoleOptions,
              },
              {
                path: '/:id',
                type: 'get',
                middleware: [authPermission('system:role:detail')],
                action: getRole,
              },
              {
                path: '/:id',
                type: 'put',
                middleware: [authPermission('system:role:edit')],
                action: updateRole,
              },
              {
                path: '/:id',
                type: 'delete',
                middleware: [authPermission('system:role:del')],
                action: deleteRole,
              },
              {
                path: '',
                type: 'post',
                middleware: [authPermission('system:role:add')],
                action: createRole,
              },
            ],
          },
          // 部门
          {
            name: 'dept',
            path: '/dept',
            middleware: [],
            routes: [
              {
                path: '',
                type: 'get',
                middleware: [authPermission('system:dept:list')],
                action: getDepts,
              },

              {
                path: '/tree',
                type: 'get',
                middleware: [authPermission('system:dept:tree')],
                action: getDeptTree,
              },
              {
                path: '/:id',
                type: 'get',
                middleware: [authPermission('system:dept:detail')],
                action: getDept,
              },
              {
                path: '/:id',
                type: 'put',
                middleware: [authPermission('system:dept:edit')],
                action: updateDept,
              },
              {
                path: '/:id',
                type: 'delete',
                middleware: [authPermission('system:dept:del')],
                action: deleteDept,
              },
              {
                path: '',
                type: 'post',
                middleware: [authPermission('system:dept:add')],
                action: createDept,
              },
            ],
          },
        ],
      },
      {
        name: 'blog',
        path: '/blog',
        middleware: [],
        routes: [
          {
            name: 'blogUser',
            path: '/user',
            middleware: [],
            routes: [
              {
                path: '',
                type: 'get',
                middleware: [authPermission('blog:user:list')],
                action: getUserList,
              },
              {
                path: '/:id',
                type: 'get',
                middleware: [authPermission('blog:user:detail')],
                action: getUserDetail,
              },
              {
                path: '',
                type: 'post',
                middleware: [authPermission('blog:user:add')],
                action: createUser,
              },
              {
                path: '/:id',
                type: 'put',
                middleware: [authPermission('blog:user:edit')],
                action: updateUser,
              },
              {
                path: '/:id',
                type: 'delete',
                middleware: [authPermission('blog:user:del')],
                action: deleteUser,
              },
            ],
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
