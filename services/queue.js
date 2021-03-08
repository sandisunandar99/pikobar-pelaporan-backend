
const service = 'services.queue'
const { createQueue } = require('../helpers/queue')
const { createJobQueue } = require('../helpers/job')
const { jobCaseExport, jobHistoryExport } = require('../helpers/job/export_xlsx')

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
  const nameQueue = 'queue-export-cases'
  const nameJob = 'job-export-cases'
  const message = `Data Kasus Pikobar Pelaporan : ${user.fullname}`

  await sameCondition(nameQueue, nameJob, callback)

  try {
    createJobQueue(nameQueue, query, user, jobCaseExport, message, 1)
  } catch (error) {
    return error
  }
}

const historyExport = async (query, user, callback) => {
  const nameQueue = 'queue-export-histories'
  const nameJob = 'job-export-histories'
  const message = `Data Riwayat Kasus Pikobar Pelaporan : ${user.fullname}`

  await sameCondition(nameQueue, nameJob, callback)

  try {
    createJobQueue(nameQueue, query, user, jobHistoryExport, message, 1)
  } catch (error) {
    return error
  }
}

module.exports = [
  { name: `${service}.queuCase`, method: caseExport },
  { name: `${service}.queuHistory`, method: historyExport },
]