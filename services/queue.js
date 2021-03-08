
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

const sameCondition = async (name, callback) => {
  try {
    const nameQueue = `queue-export-${name}`
    const nameJob = `job-export-${name}`
    const result = await createQueue(nameQueue, nameJob)
    const data = mapingResult(result)
    callback (null, data)
  } catch (error) {
    callback(error, null)
  }
}

const caseExport = async (query, user, callback) => {
  const message = `Data Kasus Pikobar Pelaporan : ${user.fullname}`

  await sameCondition('cases', callback)
  createJobQueue('cases', query, user, jobCaseExport, message, 1)
}

const historyExport = async (query, user, callback) => {
  const message = `Data Riwayat Kasus Pikobar Pelaporan : ${user.fullname}`

  await sameCondition('histories', callback)
  createJobQueue('histories', query, user, jobHistoryExport, message, 1)
}

module.exports = [
  { name: `${service}.queuCase`, method: caseExport },
  { name: `${service}.queuHistory`, method: historyExport },
]