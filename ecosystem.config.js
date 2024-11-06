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
      ignore_watch: ['node_modules', 'logs', 'uploads', '.github'],
      watch: true,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
