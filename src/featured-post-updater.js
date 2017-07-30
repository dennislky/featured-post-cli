import cli from 'cli'
import config from 'config'
import bunyan from 'bunyan'
import redis from 'ioredis'
import fetch from 'node-fetch'
import mongoClient from 'mongodb'
import PostUpdateLib from './lib/post-update'

cli.enable('help', 'version')
cli.parse({
  index: ['i', `1: update latest posts,
                2: update featured posts`, 'int', 0],
  number: ['n', 'number of post', 'int', 200],
})
const { options } = cli
const index = options.index
const postNumber = options.number

const bunyanConfig = { name: 'featured-post-updater' }
if (process.env.DEBUG) {
  bunyanConfig.level = 'debug'
}
const logger = bunyan.createLogger(bunyanConfig)

const RedisConfig = config.get('redis')
const redisClient = redis.createClient(RedisConfig.url)

const InstagramConfig = config.get('instagram')

const MongoConfig = config.get('mongodb')
const MongoOptions = {
  ssl: true,
  poolSize: 10000,
  reconnectTries: 1
}

const postUpdateLib = new PostUpdateLib({
  redisClient,
  mongoClient,
  fetch,
  logger,
  RedisConfig,
  InstagramConfig,
  MongoConfig,
  MongoOptions
})

async function updateLatestPosts({ postNumber }) {
  console.log('\nupdating latest posts\n')
  return await postUpdateLib.updateLatestPosts({ postNumber })
}

async function updateFeaturedPosts({}) {
  console.log('\nupdating featured posts\n')
  return await postUpdateLib.updateFeaturedPosts({})
}

async function task() {
  if (index == 0 || index == 1) await updateLatestPosts({ postNumber })
  if (index == 0 || index == 2) await updateFeaturedPosts({})
  redisClient.quit()
}

task()
