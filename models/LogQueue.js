
const mongoose = require('mongoose')

const LogQueueSchema = new mongoose.Schema({
  name: { type: String, default: null, index : true },
  job_id: { type: Number, default: 0, index : true },
  job_name: { type: String, default: null, index : true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  history: [{
    job_status: { type: String, index: true, default: null },
    email_status: { type: String, index: true, default: null },
  }]
}, { timestamps:true })

module.exports = mongoose.model('LogQueue', LogQueueSchema)