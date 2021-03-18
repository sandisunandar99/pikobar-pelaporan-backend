
const mongoose = require('mongoose')

const LogQueueSchema = new mongoose.Schema({
  job_id: {
    type: String, default: null, unique: true,
    required: [true, "can't be blank"], index : true
  },
  job_name: { type: String, default: null, index : true },
  job_status: { type: String, index: true, default: null },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  email: { type: String, index: true, default: null },
  status: { type: String, index: true, default: null },
}, { timestamps:true })

module.exports = mongoose.model('LogQueue', LogQueueSchema)