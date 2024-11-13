/**
 * 该文件用于配置PM2
 * https://pm2.fenxianglu.cn/docs/general/configuration-file/
 */
const { name, main } = require('./package.json')
const path = require('path')
const os = require('os')

module.exports = {
  apps: [
    {
      name,
      script: path.resolve(__dirname, main),
      instances: os.cpus().length,
      exec_mode: 'cluster',
      interpreter: 'ts-node',
      ignore_watch: ['node_modules', 'logs', 'uploads', '.github'],
      watch: ['src', 'package.json'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
