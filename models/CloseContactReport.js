const uniqueValidator = require('mongoose-unique-validator')
const validateOptions = { message: 'This Close contact already has a report' }
const mongoose = require('mongoose')
const consts = require('../helpers/constants')

const refCloseContact = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContact',
    unique: true,
    required: true
}
const refCloseContactReportHistory = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContactReportHistory'
}
 
const CloseContactReportSchema = new mongoose.Schema({
    interviewer_name: { type: String, required: true},
    contact_tracing_date: { type:Date, default:Date.now() },
    nik : { type: String, required: true },
    name : { type: String, required: true },
    phone_number : String,
    birth_date : Date,
    age : { type:Number, default: 0 },
    gender : { type: String, enum: [consts.GENDER.MALE, consts.GENDER.FEMALE] },
    address_province_code: { type: String, default: consts.DEFAULT_PROVINCE.CODE },
    address_province_name: { type: String, default: consts.DEFAULT_PROVINCE.NAME },
    address_district_code: { type: String, required: true },
    address_district_name: { type: String, required: true },
    address_subdistrict_code: { type: String, required: true },
    address_subdistrict_name: { type: String, required: true },
    address_village_code: { type: String, required: true },
    address_village_name: { type: String, required: true },
    address_rw: String,
    address_rt: String,
    address_street : String,
    relationship : String,
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
