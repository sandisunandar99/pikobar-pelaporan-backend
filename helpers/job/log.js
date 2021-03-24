const LogQueue = require('../../models/LogQueue')

const createLogJob = async (progress, job_id, job_name, queue_name, query, user) => {
  const body = {
    job_id: job_id,
    job_name: job_name,
    job_status: 'Sending',
    job_progress: progress,
    queue_name: queue_name,
    author: user.id,
    email: query.email,
    file_name: query.file_name || null,
    path: query.path || null,
  }
  try {
    return await LogQueue.create(body)
  } catch (error) {
    return error
  }
}

const updateLogJob = async (job_id, param) => {
  try {
    return await LogQueue.findOneAndUpdate({ job_id: job_id }, param), { lean: true };
  } catch (error) {
    return error
  }
}

module.exports = {
  createLogJob, updateLogJob
}