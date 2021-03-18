const nodemailer = require('nodemailer')
const fs = require('fs')
//Instantiate the SMTP server
const smtpTrans = nodemailer.createTransport({
	host: process.env.HOST_EMAIL,
	port: process.env.EMAIL_PORT,
	secure: true,
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS
	},
	tls: {
		rejectUnauthorized: false
	}
})

// verify connection configuration
smtpTrans.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server Email is ready to take our messages");
  }
});

//Specify what the email will look like
const optionsWithAttachment = (subject, attachments, email) => {
	return {
    from: process.env.GMAIL_USER,
	  to: email,
	  subject, attachments
  }
}

const sendEmailWithAttachment = (subject, attachments, email, path) => {
  smtpTrans.sendMail(optionsWithAttachment(subject, attachments, email), (err, res)=>{
    if(err) {
      console.error(err)
    } else {
      fs.unlinkSync(path)
    }
  })
}


module.exports = {
  sendEmailWithAttachment
}