import * as Koa from 'koa'
import * as Router from '@koa/router'
import * as bodyParser from 'koa-bodyparser'
import { PORT } from './config'
import routesAction from './routes'
import { WebSocketService } from '@/websocket/websocket-service'
import { WebSocketServer } from 'ws'

var http = require('http')

const app = new Koa()
const router = new Router()

//路由及处理
routesAction.forEach(({ path, type, action }) => router[type](path, action))

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(PORT)

const wss = new WebSocketService(8081, '/ws')

console.log(`应用启动成功 端口:${PORT}`)
