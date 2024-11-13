import * as Koa from 'koa'
import * as log4js from 'log4js'
const path = require('path')

// 日志根目录
let baseLogPath = path.resolve(__dirname, '@src/logs')
// 请求日志目录
let reqPath = '/request'
// 请求日志文件名
let reqFileName = 'request'
// 请求日志输出完整路径
let reqLogPath = baseLogPath + reqPath + '/' + reqFileName

// 响应日志目录
let resPath = '/response'
// 响应日志文件名
let resFileName = 'response'
// 响应日志输出完整路径
let resLogPath = baseLogPath + resPath + '/' + resFileName

// 错误日志目录
let errPath = '/error'
// 错误日志文件名
let errFileName = 'error'
// 错误日志输出完整路径
let errLogPath = baseLogPath + errPath + '/' + errFileName

log4js.configure({
  appenders: {
    // 所有的日志
    console: { type: 'console' },
    // 请求日志
    reqLogger: {
      type: 'dateFile', // 日志类型
      filename: reqLogPath, // 输出文件名
      pattern: '-yyyy-MM-dd-hh.log', // 后缀
      alwaysIncludePattern: true, // 上面两个参数是否合并
      encoding: 'utf-8', // 编码格式
      maxLogSize: 1024 * 1024, // 最大存储内容
    },
    // 响应日志
    resLogger: {
      type: 'dateFile',
      filename: resLogPath,
      pattern: '-yyyy-MM-dd-hh.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      maxLogSize: 1024 * 1024,
    },
    // 错误日志
    errLogger: {
      type: 'dateFile',
      filename: errLogPath,
      pattern: '-yyyy-MM-dd-hh.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      maxLogSize: 1024 * 1024,
    },
  },
  // 分类以及日志等级
  categories: {
    default: {
      appenders: ['console'],
      level: 'all',
    },
    reqLogger: {
      appenders: ['reqLogger'],
      level: 'info',
    },
    resLogger: {
      appenders: ['resLogger'],
      level: 'info',
    },
    errLogger: {
      appenders: ['errLogger'],
      level: 'error',
    },
  },
})

/**
 * 通用日志处理类
 */
class CommonHandle {
  constructor() {}
  /**
   * 格式化请求日志
   * @param ctx
   * @param time
   * @returns
   */
  static formatReqLog(ctx: Koa.Context, time: number = 0) {
    let text = '------------request start------------'
    let method = ctx.method
    text += `request method: ${method} \n request url: ${ctx.originalUrl} \n`
    if ((method = 'GET')) {
      text += `request data: ${JSON.stringify(ctx.query)} \n`
    } else {
      text += `request data: ${JSON.stringify(ctx.body)} \n`
    }
    text += `ctx all: ${JSON.stringify(ctx)}`
    return text
  }
  /**
   * 格式化响应日志
   * @param ctx
   * @param time
   * @returns
   */
  static formatResLog(ctx: Koa.Context, time: number = 0) {
    let text = '------------response start------------'
    text += `response status: ${ctx.status} \n`
    text += `response result: ${JSON.stringify(ctx.response.body)} \n`
    text += `response all: ${JSON.stringify(ctx)} \n`
    text += `response time: ${time} \n`
    return text
  }
  /**
   * 格式化错误日志
   * @param ctx
   * @param error
   * @param time
   * @returns
   */
  static formatErrorLog(ctx: Koa.Context, error: any, time: number = 0) {
    let text = '------------error start------------'
    text += this.formatResLog(ctx, time)
    text += `error content: ${JSON.stringify(error)}`
    return text
  }
}

class HandleLogger extends CommonHandle {
  constructor() {
    super()
  }

  // 请求日志
  static reqLogger(ctx: Koa.Context) {
    log4js.getLogger('reqLogger').info(this.formatReqLog(ctx))
  }

  // 相应日志
  static resLogger(ctx: Koa.Context, time: number) {
    log4js.getLogger('resLogger').info(this.formatResLog(ctx, time))
  }

  // 错误日志
  static errorLogger(ctx: Koa.Context, error: any, time: number) {
    log4js.getLogger('errLogger').info(this.formatErrorLog(ctx, error, time))
  }
}

export default () => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const startTime = new Date()
    let period: number = 0
    try {
      // 请求日志
      HandleLogger.reqLogger(ctx)
      await next()
      period = new Date().getTime() - startTime.getTime()
      // 响应日志
      HandleLogger.resLogger(ctx, period)
    } catch (err) {
      period = new Date().getTime() - startTime.getTime()
      // 错误日志
      HandleLogger.errorLogger(ctx, err, period)
    }
  }
}
