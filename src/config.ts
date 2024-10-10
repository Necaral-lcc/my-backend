import * as dotenv from 'dotenv'

dotenv.config({
  path: ['.env', '.env.development', '.env.production'],
})

const nodeEnv = process.env.node_env || 'development'

const PORT = process.env[`${nodeEnv}_PORT`] || process.env.PORT || 3000

const SECRET_KEY =
  process.env[`${nodeEnv}_SECRET_KEY`] ||
  process.env.SECRET_KEY ||
  'defaultSecretKey'

const TOKEN_KEY =
  process.env[`${nodeEnv}_TOKEN_KEY`] || process.env.TOKEN_KEY || 'token'

const JWT_EXPIRE_TIME =
  process.env[`${nodeEnv}_JWT_EXPIRE_TIME`] ||
  process.env.JWT_EXPIRE_TIME ||
  3600000

export { PORT, SECRET_KEY, TOKEN_KEY, JWT_EXPIRE_TIME }
