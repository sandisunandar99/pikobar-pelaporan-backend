const Queue = require('bee-queue')
const { sendEmailWithAttachment } = require('../email')
const { createLogStatus } = require('./log')
const options = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
}

const emailOptions = (resultJob) => {
  const fs = require('fs')
  return [{
    filename: resultJob.filename,
    content: fs.createReadStream(resultJob.path),
    path: resultJob.path,
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }]
}

const createJobQueue = async (nameQueue, method, message, time) => {
  try {
    const jobQueue = new Queue(nameQueue, options)
    jobQueue.process(async (job, done) => {
      setTimeout(() => {
        console.log(`⏱️  Preparing : Queue name ${nameQueue} ${job.id}`)
      }, 1500)
      const timer = setInterval( async () => {
        const set = { 'message.job': job.status, 'job_progress': 50 }
        await createLogStatus(job.id, set) // notify job progress and save
        const resultJob = await method(job.data.query, job.data.user, job.id)
        console.log(`🧾 Success : Waiting for sending email`)

        sendEmailWithAttachment(message, emailOptions(resultJob), job.data.query.email, resultJob.path, job.id, job.queue.name)
        done()
        clearInterval(timer)
      }, time * 60 * 1000)
    })
  } catch (error) {
    const set = { 'message.job': error.toString(), 'job_progress': 50 }
    await createLogStatus(job.id, set) // save job error
  }
}

module.exports = {
  createJobQueue
}