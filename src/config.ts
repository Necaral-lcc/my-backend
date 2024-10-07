import * as dotenv from 'dotenv'

dotenv.config({
  path: ['.env', '.env.development', '.env.production'],
})

const nodeEnv = process.env.node_env || 'development'

const PORT = process.env[`${nodeEnv}_PORT`] || process.env.PORT || 3000

export { PORT }
