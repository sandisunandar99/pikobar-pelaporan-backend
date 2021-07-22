## HOW TO USE

documentation of beequee [https://github.com/bee-queue/bee-queue](https://github.com/bee-queue/bee-queue)

### CODE QUALITY (CODE OF CONDUCT)
This custom function for globally package bee-queue redis job working using email for notify if progress is done

```javascript
/**
 *
 *
 * @param {*} nameQueue
 * @param {*} query
 * @param {*} user
 * @param {*} method
 * @param {*} message
 * @param {*} time
 */
const options = {
  activateDelayedJobs: true,
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
        updateLogJob(job.id, { job_progress: 55 }) // notify job progress and save
        const resultJob = await method(job.data.query, job.data.user, job.id)
        console.log(`🧾 Success : Waiting for sending email`)

        await updateLogJob(job.id, { job_progress: 85 }) // notify job progress and save
        done()
        clearInterval(timer)
        sendEmail(message, emailOptions(resultJob), job.data.query.email, resultJob.path, job.id)
      }, time * 60 * 1000)
    })
  } catch (error) {
    const param = {
      job_status: 'Error', job_progress: 85,
      type: 'job', message: error.toString()
    }
    await updateLogJob(job.id, param) // save job error
  }
}
```

example in your service

```javascript
const { createJobQueue } = require('helpers/job')
const queuSomething = async () => {
  await createJobQueue('name-queue', query, user, method, message, time)
}
```
