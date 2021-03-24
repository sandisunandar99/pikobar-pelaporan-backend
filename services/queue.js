
const service = 'services.queue'
const { createQueue, cancelQueue } = require('../helpers/queue')
const { createJobQueue } = require('../helpers/job')
const { createLogJob, updateLogJob } = require('../helpers/job/log')
const { jobCaseExport, jobHistoryExport } = require('../helpers/job/export_xlsx')
const { QUEUE, JOB } = require('../helpers/constant')
const User = require('../models/User')
const LogQueue = require('../models/LogQueue')
const { filterLogQueue } = require('../helpers/filter/log')
const { jsonPagination } = require('../utils')
const { readFileFromBucket } = require('../config/aws')
const { sendEmailWithAttachment } = require('../helpers/email')
const select = [
  'email','createdAt', 'job_id', 'job_status', 'job_progress', 'file_name', 'path',
  'queue_name'
]
const uniqueBatchId = require('uuid').v4()

const mapingResult = (result) => {
  const data = {}
  data.jobId = result.id
  data.progress = result.progress
  data.title = result.data
  data.timestamp = result.options.timestamp
  data.status = result.status

  return data
}

const sameCondition = async (query, user, queue, job, method, name, time, callback) => {
  try {
    const batchId = require('uuid').v4()
    const result = await createQueue(queue, job, batchId)
    //save user and status job
    await createLogJob(10, batchId, job, queue, query, user)
    await User.findByIdAndUpdate(user.id, { $set: { email: query.email } })
    const data = mapingResult(result)
    callback (null, data)

    const message = `Data${name}Kasus Pikobar Pelaporan : ${user.fullname}`
    await createJobQueue(queue, query, user, method, message, time)
  } catch (error) {
    callback(error, null)
  }
}

const caseExport = async (query, user, callback) => {
  await sameCondition(
    query, user, QUEUE.CASE, JOB.CASE, jobCaseExport, ' ', 10, callback
  )
}

const historyExport = async (query, user, callback) => {
  await sameCondition(
    query, user, QUEUE.HISTORY, JOB.HISTORY, jobHistoryExport, ' Riwayat ', 10, callback
  )
}

const listExport = async (query, user, callback) => {
  try {
    const where = filterLogQueue(user, query)
    const page = query.page || 1
    const limit = query.limit || 100
    const result = await LogQueue.find(where)
    .select(select)
    .sort({ '_id' : -1 })
    .limit(limit)
    .skip((limit * page) - limit)
    .lean()
    const count = await LogQueue.estimatedDocumentCount()
    const countPerPage = Math.ceil(count / limit)
    const dataMapping = {
      result,
      page: page,
      countPerPage,
      count,
      limit: limit
    }
    callback(null, jsonPagination('history', dataMapping))
  } catch (error) {
    callback(error, nul)
  }
}

const resendFile = async (payload, user, callback) => {
  try {
    let bucketName
    if(payload.name === JOB.CASE){
      bucketName = process.env.CASE_BUCKET_NAME
    } else {
      bucketName = process.env.HISTORY_BUCKET_NAME
    }
    const getFile = await readFileFromBucket(bucketName, payload.file_name)
    const options = [{
      filename: payload.file_name,
      content: getFile.Body,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }]
    await createLogJob(100, uniqueBatchId, payload.name, payload.queue_name, payload, user)
    await User.findByIdAndUpdate(user.id, { $set: { email: payload.email } })
    sendEmailWithAttachment(
      "Data Kasus Pikobar Pelaporan", options, payload.email, '', uniqueBatchId
    )
    callback(null, `data send to ${payload.email}`)
  } catch (error) {
    callback(error, null)
  }
}

const cancelJob = async (query, payload, callback) => {
  try {
    await cancelQueue(payload.name, query.jobid)
    await updateLogJob(query.jobid, { job_status: 'Canceled' })
    callback(null, `job id ${query.jobid} canceled`)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  { name: `${service}.queuCase`, method: caseExport },
  { name: `${service}.queuHistory`, method: historyExport },
  { name: `${service}.listExport`, method: listExport },
  { name: `${service}.resendFile`, method: resendFile },
  { name: `${service}.cancelJob`, method: cancelJob },
]