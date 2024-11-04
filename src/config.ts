import * as dotenv from 'dotenv'

dotenv.config({
  path: ['.env'],
})

// 环境变量
const nodeEnv = process.env.node_env || 'development'

// 服务端口
export const PORT = process.env.PORT || 3000

export const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 3001

// admin 密钥
export const ADMIN_SECRET_KEY =
  process.env.ADMIN_SECRET_KEY || 'defaultAdminSecretKey'

// app 密钥
export const APP_SECRET_KEY =
  process.env.APP_SECRET_KEY || 'defaultAppSecretKey'

// token header key
export const TOKEN_KEY = process.env.TOKEN_KEY || 'token'

/**
 * JWT 过期时间 单位：秒
 */
export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME || 3600000

console.log('nodeEnv:', nodeEnv)
console.log('PORT:', PORT)
console.log('ADMIN_SECRET_KEY:', ADMIN_SECRET_KEY)
console.log('APP_SECRET_KEY:', APP_SECRET_KEY)
console.log('TOKEN_KEY:', TOKEN_KEY)
console.log('JWT_EXPIRE_TIME:', JWT_EXPIRE_TIME)
