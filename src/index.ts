import * as Koa from 'koa'
import * as Router from '@koa/router'
import * as bodyParser from 'koa-bodyparser'
import * as jwt from 'koa-jwt'
import { PORT, ADMIN_SECRET_KEY, APP_SECRET_KEY, TOKEN_KEY } from './config'
import routesAction from '@/routes'
import { WebSocketService } from '@/websocket/websocket-service'
import { formatResponse } from './utils'
import log4js from '@/middleware/log4js'

const app = new Koa()
const router = new Router()

// 注册路由以及中间件
routesAction.forEach(({ path, type, action, middleware = [] }) => {
  if (type) {
    const r = router as any
    r[type](path, ...middleware, action)
    console.log(`注册路由${type} ${path}`)
  }
})

// 注册日志中间件
app.use(log4js())

// jwt验证
app.use(function (ctx, next) {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.body = formatResponse(null, '请登录后再进行操作', 401)
    } else {
      throw err
    }
  })
})

// 加载中间件
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

// 启动服务
app.listen(PORT)

// 启动websocket服务
const wss = new WebSocketService(8081, '/ws')

console.log(`应用启动成功 端口:${PORT},ws端口:8081`)
