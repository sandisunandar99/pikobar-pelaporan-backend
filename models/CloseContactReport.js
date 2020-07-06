const mongoose = require('mongoose')
const consts = require('../helpers/constant')
const { TYPE } = require('../helpers/constant').MONGOOSE_SCHEMA

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
    interviewer_name: TYPE.STRING.REQUIRED,
    contact_tracing_date: TYPE.DATE.NOW,
    nik : TYPE.STRING.REQUIRED,
    name : TYPE.STRING.REQUIRED,
    phone_number : TYPE.STRING.DEFAULT,
    birth_date : TYPE.DATE.DEFAULT,
    age : TYPE.NUMBER.DEFAULT,
    gender: TYPE.STRING.ENUM([consts.GENDER.MALE, consts.GENDER.FEMALE]),
    address_province_code: TYPE.STRING.DEFAULT_VALUE(consts.DEFAULT_PROVINCE.CODE),
    address_province_name: TYPE.STRING.DEFAULT_VALUE(consts.DEFAULT_PROVINCE.NAME),
    address_district_code: TYPE.STRING.REQUIRED,
    address_district_name: TYPE.STRING.REQUIRED,
    address_subdistrict_code: TYPE.STRING.REQUIRED,
    address_subdistrict_name: TYPE.STRING.REQUIRED,
    address_village_code: TYPE.STRING.REQUIRED,
    address_village_name: TYPE.STRING.REQUIRED,
    address_rw: TYPE.STRING.DEFAULT,
    address_rt: TYPE.STRING.DEFAULT,
    address_street : TYPE.STRING.DEFAULT,
    relationship : TYPE.STRING.DEFAULT,
    travel_contact_date: TYPE.DATE.DEFAULT,
    trevel_is_went_abroad: TYPE.BOOLEAN.DEFAULT,
    travel_visited_country: TYPE.STRING.DEFAULT,
    travel_is_went_other_city : TYPE.BOOLEAN.DEFAULT,
    travel_visited_city : TYPE.STRING.DEFAULT,
    travel_depart_date : TYPE.DATE.DEFAULT,
    travel_return_date : TYPE.DATE.DEFAULT,
    travel_occupation: TYPE.STRING.DEFAULT,
    travel_address_office: TYPE.STRING.DEFAULT,
    travel_transportations: TYPE.ARRAY.DEFAULT,
    home_contact_date: TYPE.DATE.DEFAULT,
    home_contact_durations: TYPE.STRING.DEFAULT,
    home_contact_days: TYPE.STRING.DEFAULT,
    home_activities: TYPE.ARRAY,
    officer_is_contact: TYPE.DATE.DEFAULT,
    officer_protection_tools: TYPE.ARRAY,
    close_contact : REF_CLOSE_CONTACT,
    latest_report_history : REF_CLOSE_CONTACT_REPORT_HISTORY,
    delete_status: TYPE.STRING.DEFAULT,
    deletedAt: TYPE.DATE.DEFAULT,
    deletedBy: REF_USER,
}, { timestamps : true });

module.exports = mongoose.model('CloseContactReport', CloseContactReportSchema)
