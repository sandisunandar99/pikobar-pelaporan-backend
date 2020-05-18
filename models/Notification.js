const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    tag: { type: String, lowercase: true, default: null},
    message: { type: String, lowercase: true, default: null},
    case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    is_read : { type: Boolean, default: false }
}, { timestamps : true });

NotificationSchema.index( { is_read: 1 } )
NotificationSchema.index( { recipient: 1 } )

NotificationSchema.methods.toJSONFor = function () {
    return {
        _id: this._id,
        tag: this.tag,
        message: this.message,
        case : this.case ? this.case.JSONFormIdCase() : null,
        sender : this.sender ? this.sender.JSONCase() : null,
        recipient : this.recipient ? this.recipient.JSONCase() : null,
        is_read: this.is_read
    }
}

module.exports = mongoose.model('Notification', NotificationSchema)
