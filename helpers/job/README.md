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
const createJobQueue = (nameQueue, query, user, method, message, time) => {
  const jobQueue = new Queue(nameQueue, options)
  jobQueue.process(async (job, done) => {
    setTimeout(() => {
      console.log(`⏱️  Preparing : Queue name ${nameQueue} ${job.id}`)
      job.reportProgress(10)
    }, 1500)

    const timer = setInterval( async () => {
      clearInterval(timer)
      const resultJob = await method(query, user)
      console.log(`🧾 Success : Queue name ${nameQueue} ${job.id} ready sending to user : ${user.fullname}`)
      job.reportProgress(100)
      done()

      // notify job and attempt to send the mail
      const options = [{
        filename: resultJob.filename,
        content: fs.createReadStream(resultJob.path),
        path: resultJob.path,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }]

      sendEmailWithAttachment(message, options, user, resultJob.path)
    }, time * 60 * 1000)
  })
}
```

example in your service

```javascript
const { createJobQueue } = require('helpers/job')
const queuSomething = async () => {
  await createJobQueue('name-queue', query, user, method, message, time)
}
```
