const Queue = require('bee-queue')
const options = {
  isWorker: false,
  sendEvents: false,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
}

const createQueue = async (nameQueue, nameJob, batchId) => {
  const initialQueue = new Queue(nameQueue, options)
  return initialQueue.createJob(nameJob).setId(batchId).save()
}

module.exports = {
  createQueue
}