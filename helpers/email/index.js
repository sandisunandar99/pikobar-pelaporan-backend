const nodemailer = require('nodemailer')
const { SUBJECT_NAME, TEXT_CASE, TEXT_HISTORY, QUEUE } = require('../constant')
const { createLogStatus } = require('../job/log')
const Sentry  = require('@sentry/node')
//Initial the SMTP server
const smtpTrans = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	},
  sender: SUBJECT_NAME,
  secureConnection: true
})

// verify connection configuration
smtpTrans.verify(function(error, success) {
  if (error) {
    Sentry.captureException(error)
  } else {
    console.log(`Server Email is ready to take our messages with status ${success}`);
  }
});

//Specify what the email will look like
const optionsEmail = (subject, message, email, jobName) => {
  let text
  if (jobName === QUEUE.CASE) {
    text = `${TEXT_CASE} ${message}`
  } else {
    text = `${TEXT_HISTORY} ${message}`
  }
	return {
    from: process.env.EMAIL_FROM,
	  to: email,
	  subject, text
  }
}

const condition = async (err, jobId, res) => {
  if(err) {
    console.info(`sending email error : ${err}`)
    const set = { 'message.email':err.toString(), 'job_status': 'Error', 'job_progress': 0 }
    await createLogStatus(jobId, set)
  } else {
    console.info(`sending email success`)
    const set = { 'message.email': `Email Sent ${res.response}`, 'job_status': 'Sent', 'job_progress': 100 }
    await createLogStatus(jobId, set)
  }
}

const sendEmail = (subject, message, email, jobId, jobName) => {
  smtpTrans.sendMail(optionsEmail(subject, message, email, jobName), async (err, res) => {
    await condition(err, jobId, res)
  })
}

module.exports = {
  sendEmail
}