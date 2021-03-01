const mongoose = require('mongoose')

const LogSelfReport = new mongoose.Schema({
   user_id: String,
   name: String,
   nik: String,
   phone_number: String
})


LogSelfReport.methods.toJSONFor = function () {
    return {
      user_id: this.User_id,
      name: this.Name,
      nik: this.Nik,
      phone_number: this.Phone_number
    }
}


module.exports = mongoose.model('LogSelfReport', LogSelfReport)
