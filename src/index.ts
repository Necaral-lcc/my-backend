import * as Koa from 'koa'
import * as Router from '@koa/router'
import * as bodyParser from 'koa-bodyparser'
import { PORT, SECRET_KEY, TOKEN_KEY } from './config'
import routesAction from '@/routes'
import { WebSocketService } from '@/websocket/websocket-service'
import { WebSocketServer } from 'ws'
import * as jwt from 'koa-jwt'
import { formatResponse } from './utils'

var http = require('http')

const app = new Koa()
const router = new Router()

//路由及处理
routesAction.forEach(({ path, type, action }) => router[type](path, action))

app.use(function (ctx, next) {
  console.log(ctx.request.url)

  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401
      ctx.body = formatResponse(null, '请登录后再进行操作', 401)
    } else {
      throw err
    }
  })
})

app.use(
  jwt({
    secret: SECRET_KEY,
    key: 'user',
  }).unless({
    path: [
      /^\/admin-api\/login/,
      /^\/admin-api\/register/,
      /^\/app-api\/login/,
      /^\/app-api\/register/,
    ],
  })
)

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(PORT)

const wss = new WebSocketService(8081, '/ws')

console.log(`应用启动成功 端口:${PORT}`)
