
const service = 'services.queue'
const { createQueue } = require('../helpers/queue')
const { createJobQueue } = require('../helpers/job')
const { jobCaseExport, jobHistoryExport } = require('../helpers/job/export_xlsx')
const { QUEUE, JOB } = require('../helpers/constant')

const mapingResult = (result) => {
  const data = {}
  data.jobId = result.id
  data.progress = result.progress
  data.title = result.data
  data.timestamp = result.options.timestamp
  data.status = result.status

  return data
}

const sameCondition = async (queue, job, callback) => {
  try {
    const result = await createQueue(queue, job)
    const data = mapingResult(result)
    callback (null, data)
  } catch (error) {
    callback(error, null)
  }
}

const caseExport = async (query, user, callback) => {
  const message = `Data Kasus Pikobar Pelaporan : ${user.fullname}`

  await sameCondition(QUEUE.CASE, JOB.CASE, callback)
  createJobQueue(QUEUE.CASE, query, user, jobCaseExport, message, 1)
}

const historyExport = async (query, user, callback) => {
  const message = `Data Riwayat Kasus Pikobar Pelaporan : ${user.fullname}`

  await sameCondition(QUEUE.HISTORY, JOB.HISTORY, callback)
  createJobQueue(QUEUE.HISTORY, query, user, jobHistoryExport, message, 1)
}

module.exports = [
  { name: `${service}.queuCase`, method: caseExport },
  { name: `${service}.queuHistory`, method: historyExport },
]