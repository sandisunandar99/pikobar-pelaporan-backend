const Queue = require('bee-queue')
const { sendEmail } = require('../email')
const { createLogStatus } = require('./log')
const { getSingedUrl } = require('../../config/aws')
const { QUEUE } = require('../constant')
const { beeQueue } = require('../../config/config')

const bucketOptions = async (nameQueue, fileName) => {
  let bucketName
  if(nameQueue === QUEUE.CASE) {
    bucketName = process.env.CASE_BUCKET_NAME
  } else {
    bucketName = process.env.HISTORY_BUCKET_NAME
  }
  return await getSingedUrl(bucketName, fileName)
}

const createJobQueue = async (nameQueue, method, message, time) => {
  try {
    const jobQueue = new Queue(nameQueue, beeQueue)
    jobQueue.process(async (job, done) => {
      setTimeout(() => {
        console.log(`⏱️  Preparing : Queue name ${nameQueue} ${job.id}`)
      }, 1500)
      const timer = setInterval( async () => {
        const set = { 'message.job': job.status, 'job_progress': 0 }
        await createLogStatus(job.id, set) // notify job progress and save
        const resultJob = await method(job.data.query, job.data.user, job.id)
        console.log(`🧾 Success : Waiting for sending email`)
        const getPublicUrl = await bucketOptions(nameQueue, resultJob.filename)
        sendEmail(message, getPublicUrl, job.data.query.email, job.id, job.queue.name)
        done()
        clearInterval(timer)
      }, time * 60 * 1000)
    })
  } catch (error) {
    const set = { 'message.job': error.toString(), 'job_progress': 0, job_status: 'Error' }
    await createLogStatus(job.id, set) // save job error
  }
}

module.exports = {
  createJobQueue
}