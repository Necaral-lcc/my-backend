import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  deleteSelf,
} from '@/controllerAdmin/user-controller'

export default [
  {
    name: 'admin-api',
    path: '/admin-api',
    routes: [
      { path: '/user', type: 'get', action: getUsers },
      { path: '/user/:id', type: 'put', action: updateUser },
      { path: '/user/:id', type: 'delete', action: deleteUser },
      { path: '/user', type: 'post', action: createUser },
    ],
  },
]
