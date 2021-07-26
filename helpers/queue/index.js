const Queue = require('bee-queue')
const options = {
  isWorker: true,
  removeOnSuccess: true,
  activateDelayedJobs: true,
  removeOnFailure: false,
  stallInterval: 5000,
  nearTermWindow: 1200000,
  delayedDebounce: 6000,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
}

const createQueue = async (nameQueue, nameJob, batchId) => {
  const initialQueue = new Queue(nameQueue, options)

  const getJob = await initialQueue.createJob(nameJob).backoff('fixed', 1000)
                                   .retries(3).setId(batchId).save()

  getJob.on('retrying', (err) => {
    console.log(
      `Job ${getJob.id} failed with error ${err.message} but is being retried!`
    );
  });

  return getJob
}

const cancelQueue = async (nameQueue, jobId) => {
  const initialQueue = new Queue(nameQueue, options)
  try {
    return await initialQueue.removeJob(jobId)
  } catch (error) {
    return error
  }
}

module.exports = {
  createQueue, cancelQueue
}