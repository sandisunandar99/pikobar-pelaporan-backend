const consts = require('../../../helpers/constant')
const Joi = require('joi')
const {
  validateOptions
} = require('../../validations')

const historyPayload = {
  diagnosis_symptoms: Joi.array(),
  diagnosis_symptoms_date: Joi.date().allow('', null),
  diagnosis_diseases: Joi.array(),
  vaccination_influenza_vaccine: Joi.boolean(),
  vaccination_influenza_vaccine_date: Joi.date().allow('', null),
  vaccination_pvc_vaccine: Joi.boolean(),
  vaccination_pvc_vaccine_date: Joi.date().allow('', null),
  test_nasal_swab: Joi.boolean(),
  test_nasal_swab_date: Joi.date().allow('', null),
  test_nasal_swab_result: Joi.string().allow('', null),
  test_throat_swab: Joi.boolean(),
  test_throat_swab_date: Joi.date().allow('', null),
  test_throat_swab_result: Joi.string().allow('', null),
  test_nasopharyngeal_swab: Joi.boolean(),
  test_nasopharyngeal_swab_date: Joi.date().allow('', null),
  test_nasopharyngeal_swab_result: Joi.string().allow('', null),
  test_orofaringeal_swab: Joi.boolean(),
  test_orofaringeal_swab_date: Joi.date().allow('', null),
  test_orofaringeal_swab_result: Joi.string().allow('', null),
  test_serum: Joi.boolean()
}

const RequestPayload = {
  payload: Joi.object().keys({
      interviewer_name: Joi.string().allow('', null),
      contact_tracing_date: Joi.date().allow('', null),
      nik: Joi.string().allow('', null),
      nik_note: Joi.string().allow('', null),
      name: Joi.string().allow('', null).required(),
      phone_number: Joi.string().allow('', null),
      phone_number_note: Joi.string().allow('', null),
      birth_date : Joi.date().allow('', null),
      age : Joi.number().required(),
      gender : Joi.string().allow('', null).valid(consts.GENDER.MALE, consts.GENDER.FEMALE),
      address_province_code: Joi.string().required(),
      address_province_name: Joi.string().required(),
      address_district_code: Joi.string().required(),
      address_district_name: Joi.string().required(),
      address_subdistrict_code: Joi.string().required(),
      address_subdistrict_name: Joi.string().required(),
      address_village_code: Joi.string().required(),
      address_village_name: Joi.string().required(),
      address_rw: Joi.string().allow('', null),
      address_rt: Joi.string().allow('', null),
      address_street : Joi.string().allow('', null),
      relationship : Joi.string().required(),
      emergency_contact_name: Joi.string().required(),
      emergency_contact_phone: Joi.string().required(),
      emergency_contact_relationship: Joi.string().allow('', null),
      travel_contact_date: Joi.date().required(),
      trevel_is_went_abroad: Joi.boolean(),
      travel_visited_country: Joi.string().allow('', null),
      travel_is_went_other_city : Joi.boolean(),
      travel_visited_city: Joi.string().allow('', null),
      travel_depart_date: Joi.date().allow('', null),
      travel_return_date: Joi.date().allow('', null),
      travel_occupation: Joi.string().required(),
      travel_address_office: Joi.string().allow('', null),
      travel_transportations: Joi.array().required(),
      contact_type: Joi.number().allow('', null),
      contact_place: Joi.number().allow('', null),
      contact_date: Joi.date().allow('', null),
      contact_durations: Joi.number().allow('', null),
      home_contact_date: Joi.date().allow('', null),
      home_contact_days: Joi.number().allow('', null),
      home_activities: Joi.array(),
      officer_is_contact: Joi.boolean(),
      officer_protection_tools: Joi.array(),
      latest_report_history: historyPayload 
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  RequestPayload
}