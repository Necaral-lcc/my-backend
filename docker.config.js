/**
 * 该文件用于配置PM2
 * https://pm2.fenxianglu.cn/docs/general/configuration-file/
 */
const { name } = require('./package.json')
const path = require('path')

module.exports = {
  apps: [
    {
      name,
      script: path.resolve(__dirname, './src/index.ts'),
      instances: 1,
      interpreter: 'ts-node',
      watch: true,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3300,
        WEBSOCKET_PORT: 3301,
        ADMIN_SECRET_KEY: 'lcc_backend_secret_key_production',
        APP_SECRET_KEY: 'lcc_app_secret_key_production',
        TOKEN_KEY: 'token',
        JWT_EXPIRE_TIME: 3600,
        DATABASE_URL:
          'mysql://lccServer:Abc123...@localhost:3306/mydb?connect_timeout=300',
      },
    },
  ],
}
