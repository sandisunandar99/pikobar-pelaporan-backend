const mongoose = require('mongoose')
const consts = require('../helpers/constants')

const CloseContactSchema = new mongoose.Schema({
    case : { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    name : { type: String, required: true },
    phone_number : { type: String },
    gender : { type: String, enum: [consts.GENDER.MALE, consts.GENDER.FEMALE] },
    age : { type:Number, default:0 },
    address : { type:String },
    relationship : { type:String },
    activity : { type:String },
    is_reported: { type: Boolean, default: false },
    delete_status: String,
    deletedAt: { type:Date, default:Date.now() },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps : true });

module.exports = mongoose.model('CloseContact', CloseContactSchema)
