const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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
    clickAction: {
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

NotificationSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Notification', NotificationSchema)
