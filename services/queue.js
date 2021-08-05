const service = 'services.queue'
const { createQueue } = require('../helpers/queue')
const { createLogJob, createHistoryEmail } = require('../helpers/job/log')
const { connectQueue } = require('../config/redis')
const { QUEUE, JOB } = require('../helpers/constant')
const User = require('../models/User')
const LogQueue = require('../models/LogQueue')
const { filterLogQueue } = require('../helpers/filter/log')
const { jsonPagination } = require('../utils')
const { getSingedUrl } = require('../config/aws')
const { sendEmail } = require('../helpers/email')
const select = [
  'email','createdAt', 'job_id', 'job_name', 'job_status', 'job_progress', 'file_name'
]
const message = `Data Kasus Dari Aplikasi Pikobar Pelaporan`

const sameCondition = async (query, user, queue, job, callback) => {
  try {
    const batchId = require('uuid').v4()
    let result
    //save user and status job
    await User.findByIdAndUpdate(user.id, { $set: { email: query.email } })
    if (queue === QUEUE.CASE) {
      result = await createQueue(connectQueue(queue), { query, user }, batchId)
    }else {
      result = await createQueue(connectQueue(queue), { query, user }, batchId)
    }
    await createLogJob(10, batchId, job, queue, query, user)
    callback (null, result.opts)
  } catch (error) {
    callback(error, null)
  }
}

const caseExport = async (query, user, callback) => {
  await sameCondition(query, user, QUEUE.CASE, JOB.CASE, callback)
}

const historyExport = async (query, user, callback) => {
  await sameCondition(query, user, QUEUE.HISTORY, JOB.HISTORY, callback)
}

const listExport = async (query, user, callback) => {
  try {
    let searchParam = [{}];
    if(query.search) searchParam = [ { file_name : new RegExp(query.search,"i") }]
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 30
    const where = filterLogQueue(user, query)
    const result = await LogQueue.find(where)
    .or(searchParam).select(select).sort({ 'createdAt' : -1 })
    .limit(limit).skip((limit * page) - limit).lean()
    const filterCount = {...where, ...{ $or : searchParam } }
    const count = await LogQueue.countDocuments(filterCount)
    const countPerPage = Math.ceil(count / limit)
    const dataMapping = { result, page, countPerPage, count, limit }
    callback(null, jsonPagination('history', dataMapping))
  } catch (error) {
    callback(error, null)
  }
}

const resendFile = async (params, payload, user, callback) => {
  try {
    let bucketName
    let nameQueue
    if(payload.name === JOB.CASE){
      bucketName = process.env.CASE_BUCKET_NAME
      nameQueue = QUEUE.CASE
    } else {
      bucketName = process.env.HISTORY_BUCKET_NAME
      nameQueue = QUEUE.HISTORY
    }
    const urls = await getSingedUrl(bucketName, payload.file_name)
    sendEmail(
      message, urls, payload.email, params.jobid,  nameQueue,
    )
    await createHistoryEmail(payload, params.jobid)
    callback(null, `data send to ${payload.email}`)
  } catch (error) {
    callback(error, null)
  }
}

const historyEmail = async (params, payload, user, callback) => {
  try {
    const result = await LogQueue.find({ job_id: params.jobid })
    .select(['history'])
    .sort({ updatedAt: -1 })
    .lean()
    callback(null, result.shift())
  } catch (error) {
    callback(error, null)
  }
}


module.exports = [
  { name: `${service}.queuCase`, method: caseExport },
  { name: `${service}.queuHistory`, method: historyExport },
  { name: `${service}.listExport`, method: listExport },
  { name: `${service}.resendFile`, method: resendFile },
  { name: `${service}.historyEmail`, method: historyEmail },
]