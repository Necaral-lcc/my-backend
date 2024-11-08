import ioredis from 'ioredis'

const redis = new ioredis({
  host: 'localhost',
  port: 6379,
  db: 0,
})

redis.on('connect', () => {
  console.log('Redis connected')
})

redis.on('ready', () => {
  console.log('Redis ready')
})

redis.on('reconnecting', () => {
  console.log('Redis reconnecting')
})

redis.on('close', () => {
  console.log('Redis closed')
})

redis.on('error', (error) => {
  console.log('Redis error', error)
})

export default redis
