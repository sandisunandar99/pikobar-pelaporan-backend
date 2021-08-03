const redis = require('redis')
const Bull = require('bull')

const clientConfig = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

clientConfig.on("connect", function () {
  console.log("Redis Connected");
})

clientConfig.on("error", function (err) {
  console.log("Error " + err);
})

const connectQueue = (name) => {
  return new Bull(name,{
    redis: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }
  })
}

module.exports = {
  clientConfig, connectQueue
}