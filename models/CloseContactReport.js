const uniqueValidator = require('mongoose-unique-validator')
const validateOptions = { message: 'This Close contact already has a report' }
const mongoose = require('mongoose')
const refCloseContact = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContact',
    unique: true,
    required: [true, "can't be blank"]
}
const refCloseContactReportHistory = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContactReportHistory'
}
 
const CloseContactReportSchema = new mongoose.Schema({
    contact_interviewer_name: { type: String, required: [true, "can't be blank"]},
    contact_tracing_date: {type:Date, default:Date.now()},
    identity_nik : { type: String, required: [true, "can't be blank"]},
    identity_name : { type: String, required: [true, "can't be blank"]},
    identity_phone_number : { type: String, default:null},
    identity_birth_date : { type: Date},
    identity_age : {type:Number, default:0},
    identity_gender : { type: String },
    identity_address_province_code: { type: String, default:32},
    identity_address_province_name: { type: String, default:"Jawa Barat"},
    identity_address_district_code: { type: String, required: [true, "can't be blank"]},
    identity_address_district_name: { type: String, required: [true, "can't be blank"]},
    identity_address_subdistrict_code: { type: String, required: [true, "can't be blank"]},
    identity_address_subdistrict_name: { type: String, required: [true, "can't be blank"]},
    identity_address_village_code: { type: String, required: [true, "can't be blank"]},
    identity_address_village_name: { type: String, required: [true, "can't be blank"]},
    identity_address_rw: {type:String},
    identity_address_rt: {type:String},
    identity_address_street : {type:String},
    identity_family_relationship : {type:String},
    travel_contact_date: Date,
    trevel_is_went_abroad: Boolean,
    travel_visited_country: String,
    travel_is_went_other_city : Boolean,
    travel_visited_city : String,
    travel_depart_date : Date,
    travel_return_date : Date,
    travel_occupation: String,
    travel_address_office: String,
    travel_transportations: Array,
    home_contact_date: Date,
    home_contact_durations: String,
    home_contact_days: String,
    home_activities: Array,
    officer_is_contact: Boolean,
    officer_protection_tools: Array,
    close_contact : refCloseContact,
    latest_report_history : refCloseContactReportHistory,
    delete_status: String,
    deletedAt: {type:Date, default:Date.now()},
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps : true });

CloseContactReportSchema.plugin(uniqueValidator, validateOptions)
module.exports = mongoose.model('CloseContactReport', CloseContactReportSchema)
