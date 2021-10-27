const redis = require('redis')
const Bull = require('bull')

const clientConfig = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: function(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  },
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