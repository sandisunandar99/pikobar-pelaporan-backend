const jobOptions = (jobId) => {
  return {
    jobId, removeOnComplete: true,
    delay: 600000, // 1 = 60000 min in ms
    attempts: 3
  };
}
const createQueue = async (method, data, jobId) => {
  const options = jobOptions(jobId)
  return await method.add(data, options );
}
module.exports = {
  createQueue,
}