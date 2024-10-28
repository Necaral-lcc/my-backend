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
} from '@/controllerAdmin/menu-controller'
import {
  registerAdminUser,
  loginAdminUser,
  getAdminUsers,
  getAdminUser,
} from '@/controllerAdmin/adminUser-controller'

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
          { path: '/menu', type: 'post', action: createMenu },
          { path: '/menu', type: 'get', action: getMenus },
          { path: '/menuTree', type: 'get', action: getMenuTree },
          { path: '/menu/:id', type: 'get', action: getMenu },
          { path: '/adminUser', type: 'get', action: getAdminUsers },
          { path: '/adminUser/:id', type: 'get', action: getAdminUser },
          { path: '/adminUser', type: 'post', action: registerAdminUser },
        ],
      },
      // {
      //   name: 'register-admin',
      //   path: '/register',
      //   type: 'post',
      //   action: registerAdminUser,
      // },
      {
        name: 'login-admin',
        path: '/login',
        type: 'post',
        action: loginAdminUser,
      },
    ],
  },
]
