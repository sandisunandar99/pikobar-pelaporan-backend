const { exportCaseQueue, exportHistoriesQueue } = require('../../config/redis')
const jobOptions = (jobId) => {
  return {
    jobId, removeOnComplete: true,
    delay: 600000, // 1 = 60000 min in ms
    attempts: 3
  };
}
const createQueueCases = async (data, jobId) => {
  const options = jobOptions(jobId)
  return await exportCaseQueue.add({ data }, options );
}
const createQueueHistories = async (data, jobId) => {
  const options = jobOptions(jobId)
  return await exportHistoriesQueue.add({ data }, options );
}
module.exports = {
  createQueueCases, createQueueHistories
}