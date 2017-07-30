module.exports = {
  redis: {
    url: process.env.REDIS_URL, // 'redis://<url>:6379'
    prefix: process.env.REDIS_PREFIX,
    cacheDuration: process.env.REDIS_CACHE_DURATION || 60
  },
  instagram: {
    url: process.env.INSTAGRAM_URL || 'https://www.instagram.com/9gag/media/?max_id='
  },
  mongodb: {
    url: process.env.MONGO_URL, // 'mongodb://<username>:<password>@<url>:<port>/<table>?ssl=true'
  },
  server: {
    port: process.env.PORT || 8084
  }
}
