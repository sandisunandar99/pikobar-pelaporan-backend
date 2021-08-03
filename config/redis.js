const redis = require('redis')
const Bull = require('bull')
const { QUEUE } = require('../helpers/constant')

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

const exportCaseQueue = new Bull(QUEUE.CASE,{
  redis: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }
})

const exportHistoriesQueue = new Bull(QUEUE.HISTORY, {
  redis: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }
})

module.exports = {
  clientConfig, exportCaseQueue, exportHistoriesQueue
}