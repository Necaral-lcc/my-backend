import {
  getUser,
  registerUser,
  login,
  viewUser,
  deleteSelf,
  updateSelf,
} from '@/controllerApp/user-controller'
import { publishArticle } from '@/controllerApp//article-controller'

export default [
  {
    name: 'app-api',
    path: '/app-api',
    routes: [
      {
        name: 'user',
        path: '/user',
        routes: [
          // 查看自己的资料
          { path: '/self', type: 'get', action: getUser },
          // 注销
          { path: '/self', type: 'delete', action: deleteSelf },
          // 更新自己的资料
          { path: '/self', type: 'patch', action: updateSelf },
          // 查看他人资料
          { path: '/:id', type: 'get', action: viewUser },
        ],
      },
      //发表文章
      {
        name: 'article',
        path: '/article',
        routes: [{ path: '', type: 'post', action: publishArticle }],
      },
      //注册
      { path: '/register', type: 'post', action: registerUser },
      //登录
      { path: '/login', type: 'post', action: login },
    ],
  },
]
