import {
  getUser,
  registerUser,
  login,
  viewUser,
  deleteSelf,
  updateSelf,
} from '../controllerApp/user-controller'
import { publishArticle } from '../controllerApp//article-controller'
import type { IRoute } from './index'
import * as jwt from 'koa-jwt'
import { ADMIN_SECRET_KEY, APP_SECRET_KEY, TOKEN_KEY } from '../config'

const appList: IRoute[] = [
  {
    name: 'app-api',
    path: '/app-api',
    middleware: [
      jwt({
        secret: [APP_SECRET_KEY],
        key: 'user',
        tokenKey: TOKEN_KEY,
      }).unless({
        path: [/^\/app-api\/login/, /^\/app-api\/register/],
      }),
    ],
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

export default appList
