import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  deleteSelf,
} from '@/controllerAdmin/user-controller'
import {
  createMenu,
  getMenu,
  getMenus,
  getMenuTree,
  updateMenu,
} from '@/controllerAdmin/menu-controller'
import {
  registerAdminUser,
  loginAdminUser,
  getAdminUsers,
  getAdminUserForm,
  updateAdminUser,
} from '@/controllerAdmin/adminUser-controller'
import {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
  getRoleOptions,
} from '@/controllerAdmin/role-controller'

export default [
  {
    name: 'admin-api',
    path: '/admin-api',
    routes: [
      { path: '/user', type: 'get', action: getUsers },
      { path: '/user/:id', type: 'put', action: updateUser },
      { path: '/user/:id', type: 'delete', action: deleteUser },
      { path: '/user', type: 'post', action: createUser },
      {
        name: 'system',
        path: '/system',
        routes: [
          // 菜单
          { path: '/menu', type: 'post', action: createMenu },
          { path: '/menu', type: 'get', action: getMenus },
          { path: '/menu/options', type: 'get', action: getMenuTree },
          { path: '/menu/:id', type: 'get', action: getMenu },
          { path: '/menu/:id', type: 'put', action: updateMenu },
          // 管理员
          { path: '/adminUser', type: 'get', action: getAdminUsers },
          { path: '/adminUser/:id', type: 'get', action: getAdminUserForm },
          { path: '/adminUser/:id', type: 'put', action: updateAdminUser },
          { path: '/adminUser', type: 'post', action: registerAdminUser },
          // 角色
          { path: '/role', type: 'get', action: getRoles },
          { path: '/role/options', type: 'get', action: getRoleOptions },
          { path: '/role/:id', type: 'get', action: getRole },
          { path: '/role/:id', type: 'put', action: updateRole },
          { path: '/role/:id', type: 'delete', action: deleteRole },
          { path: '/role', type: 'post', action: createRole },
        ],
      },
      {
        name: 'register-admin',
        path: '/register',
        type: 'post',
        action: registerAdminUser,
      },
      {
        name: 'login-admin',
        path: '/login',
        type: 'post',
        action: loginAdminUser,
      },
    ],
  },
]
