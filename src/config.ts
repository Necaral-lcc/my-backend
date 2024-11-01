import * as dotenv from 'dotenv'

dotenv.config({
  path: ['.env', '.env.development', '.env.production'],
})

// 环境变量
const nodeEnv = process.env.node_env || 'development'

// 服务端口
export const PORT = process.env[`${nodeEnv}_PORT`] || process.env.PORT || 3000

// admin 密钥
export const ADMIN_SECRET_KEY =
  process.env[`${nodeEnv}_SECRET_KEY`] ||
  process.env.SECRET_KEY ||
  'defaultAdminSecretKey'

// app 密钥
export const APP_SECRET_KEY =
  process.env[`${nodeEnv}_APP_SECRET_KEY`] ||
  process.env.APP_SECRET_KEY ||
  'defaultAppSecretKey'

// token header key
export const TOKEN_KEY =
  process.env[`${nodeEnv}_TOKEN_KEY`] || process.env.TOKEN_KEY || 'token'

// jwt 过期时间
export const JWT_EXPIRE_TIME =
  process.env[`${nodeEnv}_JWT_EXPIRE_TIME`] ||
  process.env.JWT_EXPIRE_TIME ||
  3600000
