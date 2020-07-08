const mongoose = require('mongoose')
const consts = require('../helpers/constant')

const REF_CLOSE_CONTACT = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContact',
    unique: true,
    required: true
}
const REF_CLOSE_CONTACT_REPORT_HISTORY = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContactReportHistory'
}
const REF_USER = { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case', 
    default: null
}
 
const CloseContactReportSchema = new mongoose.Schema({
    interviewer_name: { type: String, required: true },
    contact_tracing_date: { type: Date, default: Date.now() },
    nik : { type: String, default: null },
    nik_note : { type: String, default: null },
    name : { type: String, required: true },
    phone_number : { type: String, default: null },
    phone_number_note : { type: String, default: null },
    birth_date : { type: Date, default: null },
    age : { type: Number, required: true },
    gender: { type: String, enum: [consts.GENDER.MALE, consts.GENDER.FEMALE] },
    address_province_code: { type: String, default: consts.DEFAULT_PROVINCE.CODE },
    address_province_name: { type: String, default: consts.DEFAULT_PROVINCE.NAME },
    address_district_code: { type: String, required: true },
    address_district_name: { type: String, required: true },
    address_subdistrict_code: { type: String, required: true },
    address_subdistrict_name: { type: String, required: true },
    address_village_code: { type: String, required: true },
    address_village_name: { type: String, required: true },
    address_rw: { type: String, default: null },
    address_rt: { type: String, default: null },
    address_street : { type: String, default: null },
    relationship : { type: String, required: true },
    emergency_contact_name: { type: String, required: true },
    emergency_contact_phone: { type: String, required: true },
    emergency_contact_relationship: { type: String, default: null },
    travel_contact_date: { type: Date, required: true },
    trevel_is_went_abroad: { type: Boolean, default: false },
    travel_visited_country: { type: String, default: null },
    travel_is_went_other_city : { type: Boolean, default: false },
    travel_visited_city : { type: String, default: null },
    travel_depart_date : { type: Date, default: null },
    travel_return_date : { type: Date, default: null },
    travel_occupation: { type: String, required: true },
    travel_address_office: { type: String, default: null },
    travel_transportations: { type: Array, default: [] },
    contact_type: { type: String, default: null },
    contact_place: { type: String, default: null },
    contact_date: { type: Date, default: null },
    contact_durations: { type: Number, default: 0 },
    home_contact_date: { type: Date, default: null },
    home_contact_days: { type: Number, default: 0 },
    home_activities: { type: Array, default: [] },
    officer_is_contact: { type: Boolean, default: false },
    officer_protection_tools: { type: Array, default: [] },
    close_contact : REF_CLOSE_CONTACT,
    latest_report_history : REF_CLOSE_CONTACT_REPORT_HISTORY,
    createdBy: REF_USER,
    updatedBy: REF_USER,
    delete_status: { type: String, default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: REF_USER,
}, { timestamps : true });

module.exports = mongoose.model('CloseContactReport', CloseContactReportSchema)
