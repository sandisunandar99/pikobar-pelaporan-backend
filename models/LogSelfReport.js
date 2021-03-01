const mongoose = require('mongoose')

const LogSelfReport = new mongoose.Schema({
   user_id: String,
   name: String,
   nik: String,
   phone_number: String
})

module.exports = mongoose.model('LogSelfReport', LogSelfReport)
