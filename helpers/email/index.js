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
  let html
  if (jobName === QUEUE.CASE) {
    html = `${TEXT_CASE} <br><button style="background-color: #4CAF50; /* Green */
    border: none; color: white;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;"><a style="text-decoration: none; color:black;" href="${message}"> Klik Disini </a></button>`
  } else {
    html = `${TEXT_HISTORY} <br><button style="background-color: #4CAF50; /* Green */
    border: none;color: white;
    padding: 5px 15px;text-align: center;
    text-decoration: none; display: inline-block;
    font-size: 16px; margin: 4px 2px;
    cursor: pointer;"><a style="text-decoration: none; color:black;"href="${message}"> Klik Disini </a></button>`
  }
	return {
    from: process.env.EMAIL_FROM,
	  to: email,
	  subject, html
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