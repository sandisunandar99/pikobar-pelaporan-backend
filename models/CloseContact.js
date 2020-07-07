const mongoose = require('mongoose')
const consts = require('../helpers/constant')
const REF_CASE = { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case', 
    required: true
}
const REF_USER = { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case', 
    default: null
}

const CloseContactSchema = new mongoose.Schema({
    case: REF_CASE,
    name: { type: String, required: true },
    phone_number: { type: String, default: null },
    gender: { type: String, enum: [consts.GENDER.MALE, consts.GENDER.FEMALE] },
    age: { type: Number, default: null },
    address: { type: String, default: null },
    relationship: { type: String, default: null },
    activity: { type: String, default: null },
    is_reported: { type: Boolean, default: false },
    createdBy: REF_USER,
    updatedBy: REF_USER,
    delete_status: { type: String, default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: REF_USER,
}, { timestamps : true });

module.exports = mongoose.model('CloseContact', CloseContactSchema)
