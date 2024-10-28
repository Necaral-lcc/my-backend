import * as Koa from 'koa'
import * as Router from '@koa/router'
import * as bodyParser from 'koa-bodyparser'
import * as jwt from 'koa-jwt'
import { PORT, SECRET_KEY, TOKEN_KEY } from './config'
import routesAction from '@/routes'
import { WebSocketService } from '@/websocket/websocket-service'
import { formatResponse } from './utils'
import log4js from '@/middleware/log4js'

const app = new Koa()
const router = new Router()

//路由及处理
routesAction.forEach(({ path, type, action, middleware = [] }) => {
  if (type) {
    const r = router as any
    r[type](path, ...middleware, action)
    console.log(`注册路由${type} ${path}`)
  }
})

app.use(log4js())

app.use(function (ctx, next) {
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
