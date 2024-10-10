import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  deleteSelf,
} from '@/controllerAdmin/user-controller'
import { createMenu, getMenu } from '@/controllerAdmin/menu-controller'

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
          { path: '/menu/:id', type: 'get', action: getMenu },
        ],
      },
    ],
  },
]
