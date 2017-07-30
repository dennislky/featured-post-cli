export default class {
  constructor({
    redisClient,
    mongoClient,
    fetch,
    logger,
    RedisConfig,
    InstagramConfig,
    MongoConfig,
    MongoOptions
  }) {
    Object.assign(this, {
      redisClient,
      mongoClient,
      fetch,
      logger,
      RedisConfig,
      InstagramConfig,
      MongoConfig,
      MongoOptions
    })
  }

  async updateLatestPosts({ postNumber }) {
    try {
      console.log('required posts number: '+postNumber)
      let fetchResult = await this.fetch(this.InstagramConfig.url)
      if (fetchResult.ok) {
        let fetchData = await fetchResult.json()
        let posts = fetchData.items
        let lastPost = posts[posts.length-1]
        let maxId = lastPost.id
        console.log('fetched posts number: '+posts.length)
        while (fetchData.more_available && (posts.length < postNumber)) {
          fetchResult = await this.fetch(this.InstagramConfig.url+maxId)
          if (fetchResult.ok) {
            fetchData = await fetchResult.json()
            fetchData.items.shift()
            posts = posts.concat(fetchData.items)
            lastPost = posts[posts.length-1]
            maxId = lastPost.id
          } else {
            break
          }
          console.log('fetched posts number: '+posts.length)
        }
        posts.splice(postNumber, posts.length-postNumber)
        console.log('fetched posts number after splice: '+posts.length)
        const db = await this.mongoClient.connect(this.MongoConfig.url, this.MongoOptions)
        const collection = await db.collection("test")
        const cleanup = await collection.remove({}, {})
        if (cleanup.result.ok) {
          console.log('posts mongodb cleanup success')
          const insertMany = await collection.insertMany(posts, {})
          if (insertMany.result.ok && insertMany.result.n === postNumber) {
            console.log('posts mongodb insertion success')
          } else {
            console.log('posts mongodb insertion fails')
            console.log(insertMany.result)
          }
        } else {
          console.log('posts mongodb cleanup fails')
          console.log(cleanup.result)
        }
        db.close()
        await this.redisClient.setex(`${this.RedisConfig.prefix}:latestPosts`, this.RedisConfig.cacheDuration, JSON.stringify(posts))
        console.log(`posts cached in redis for ${this.RedisConfig.cacheDuration}s`)
      } else {
        console.log(fetchResult.statusText)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async updateFeaturedPosts({}) {
    try {
      console.log('to be implemented')
    } catch (err) {
      console.log(err)
    }
  }
}
