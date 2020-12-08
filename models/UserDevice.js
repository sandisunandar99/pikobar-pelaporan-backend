const mongoose = require('mongoose')

const UserDeviceSchema = new mongoose.Schema({
  app_id: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    default: 'webapp'
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('UserDevice', UserDeviceSchema)
