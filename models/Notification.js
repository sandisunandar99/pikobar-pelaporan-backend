const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    message: {
      required: true,
      type: String,
    },
    eventRole: {
      required: true,
      type: String,
    },
    eventType: {
      required: true,
      type: String,
    },
    referenceId: {
      default: null,
      type: mongoose.Schema.Types.ObjectId,
    },
    senderId: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
    },
    recipientId: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId
    },
    isRead : {
      default: false,
      type: Boolean,
    }
}, { timestamps : true })

NotificationSchema.index( { isRead: 1 } )
NotificationSchema.index( { recipientId: 1 } )

module.exports = mongoose.model('Notification', NotificationSchema)
