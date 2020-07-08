const mongoose = require('mongoose')
const consts = require('../helpers/constant')
const mongoosePaginate = require('mongoose-paginate-v2');

const REF_CASE = { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case', 
    default: null
}
const REF_CLOSE_CONTACT_HISTORY = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloseContactHistory'
}
const REF_USER = { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case', 
    default: null
}
 
const CloseContactSchema = new mongoose.Schema({
    case: REF_CASE,
    interviewer_name: { type: String, default: null },
    contact_tracing_date: { type: Date, default: Date.now() },
    nik : { type: String, default: null },
    nik_note : { type: String, default: null },
    name : { type: String, default: null },
    phone_number : { type: String, default: null },
    phone_number_note : { type: String, default: null },
    birth_date : { type: Date, default: null },
    age : { type: Number, default: null },
    gender: { type: String, enum: [consts.GENDER.MALE, consts.GENDER.FEMALE] },
    address_province_code: { type: String, default: consts.DEFAULT_PROVINCE.CODE },
    address_province_name: { type: String, default: consts.DEFAULT_PROVINCE.NAME },
    address_district_code: { type: String, default: null },
    address_district_name: { type: String, default: null },
    address_subdistrict_code: { type: String, default: null },
    address_subdistrict_name: { type: String, default: null },
    address_village_code: { type: String, default: null },
    address_village_name: { type: String, default: null },
    address_rw: { type: String, default: null },
    address_rt: { type: String, default: null },
    address_street : { type: String, default: null },
    relationship : { type: String, default: null },
    emergency_contact_name: { type: String, default: null },
    emergency_contact_phone: { type: String, default: null },
    emergency_contact_relationship: { type: String, default: null },
    travel_is_went_abroad: { type: Boolean, default: false },
    travel_visited_country: { type: String, default: null },
    travel_country_depart_date: { type: Date, default: null },
    travel_country_return_date: { type: Date, default: null },
    travel_is_went_other_city : { type: Boolean, default: false },
    travel_visited_city : { type: String, default: null },
    travel_city_depart_date : { type: Date, default: null },
    travel_city_return_date : { type: Date, default: null },
    travel_occupation: { type: String, default: null },
    travel_address_office: { type: String, default: null },
    travel_transportations: { type: Array, default: [] },
    contact_type: { type: Number, default: 0 },
    contact_place: { type: Number, default: 0 },
    contact_date: { type: Date, default: null },
    contact_durations: { type: Number, default: 0 },
    home_contact_date: { type: Date, default: null },
    home_contact_days: { type: Number, default: 0 },
    home_contact_activities: { type: Array, default: [] },
    officer_is_contact: { type: Boolean, default: false },
    officer_protection_tools: { type: Array, default: [] },
    is_reported: { type: Boolean, default: false },
    latest_history : REF_CLOSE_CONTACT_HISTORY,
    contact_date: { type:Date, default:null },
    createdBy: REF_USER,
    updatedBy: REF_USER,
    delete_status: { type: String, default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: REF_USER,
}, { timestamps : true });

CloseContactSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('CloseContact', CloseContactSchema)
