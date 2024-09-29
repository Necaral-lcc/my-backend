import * as dotenv from 'dotenv'

dotenv.config({
  path: ['.env', '.env.development', '.env.production'],
})

const PORT = process.env[`${process.env.node_env}_PORT`] || 3001

export { PORT }
