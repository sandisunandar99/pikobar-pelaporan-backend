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

const getJobStatus = async (nameQueue, jobId) => {
  const jobQueue = new Queue(nameQueue, options)
  const getJob = await jobQueue.getJob(jobId)
  return {
    progress: getJob.progress,
    status: getJob.status
  }
}


module.exports = {
  createQueue, getJobStatus
}