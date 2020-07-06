const mongoose = require('mongoose')

const CloseContactSchema = new mongoose.Schema({
    case : { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: [true, "can't be blank"]},
    name : { type: String, required: [true, "can't be blank"]},
    phone_number : { type: String, default:null},
    gender : { type: String },
    age : {type:Number, default:0},
    address : {type:String},
    related : {type:String},
    activity : {type:String},
    delete_status: String,
    deletedAt: {type:Date, default:Date.now()},
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps : true });

module.exports = mongoose.model('CloseContact', CloseContactSchema)
