const mongoose = require('mongoose')

const UserDeviceSchema = new mongoose.Schema({
  appId: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    default: 'webapp'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('UserDevice', UserDeviceSchema)
