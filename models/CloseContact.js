const mongoose = require('mongoose')
const consts = require('../helpers/constant')
const { TYPE } = require('../helpers/constant').MONGOOSE_SCHEMA
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
    name: TYPE.STRING.DEFAULT,
    phone_number: TYPE.STRING.DEFAULT,
    gender: TYPE.STRING.ENUM([consts.GENDER.MALE, consts.GENDER.FEMALE]),
    age: TYPE.NUMBER.DEFAULT,
    address: TYPE.STRING.DEFAULT,
    relationship: TYPE.STRING.DEFAULT,
    activity: TYPE.STRING.DEFAULT,
    is_reported: TYPE.BOOLEAN.DEFAULT,
    delete_status: TYPE.STRING.DEFAULT,
    deletedAt: TYPE.DATE.DEFAULT,
    deletedBy: REF_USER,
}, { timestamps : true });

module.exports = mongoose.model('CloseContact', CloseContactSchema)
