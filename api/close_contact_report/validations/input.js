const consts = require('../../../helpers/constant')
const Joi = require('joi')
const {
  validateOptions
} = require('../../validations')

const historyPayload = {
  diagnosis_symptoms: Joi.array(),
  diagnosis_diseases: Joi.array(),
  vaccination_influenza_vaccine: Joi.boolean(),
  vaccination_influenza_vaccine_date: Joi.date().allow('', null),
  vaccination_pvc_vaccine: Joi.boolean(),
  vaccination_pvc_vaccine_date: Joi.date().allow('', null),
  test_nasal_swab: Joi.boolean(),
  test_nasal_swab_date: Joi.date().allow('', null),
  test_throat_swab: Joi.boolean(),
  test_throat_swab_date: Joi.date().allow('', null),
  test_nasopharyngeal_swab: Joi.boolean(),
  test_nasopharyngeal_swab_date: Joi.date().allow('', null),
  test_orofaringeal_swab: Joi.boolean(),
  test_orofaringeal_swab_date: Joi.date().allow('', null)
}

const RequestPayload = {
  payload: Joi.object().keys({
      interviewer_name: Joi.string().allow('', null),
      contact_tracing_date: Joi.date().allow('', null),
      nik: Joi.string().allow('', null),
      name: Joi.string().allow('', null).required(),
      phone_number: Joi.string().allow('', null),
      birth_date : Joi.date().allow('', null),
      age : Joi.number(),
      gender : Joi.string().allow('', null).valid(consts.GENDER.MALE, consts.GENDER.FEMALE),
      address_province_code: Joi.string().allow('', null),
      address_province_name: Joi.string().allow('', null),
      address_district_code: Joi.string().allow('', null),
      address_district_name: Joi.string().allow('', null),
      address_subdistrict_code: Joi.string().allow('', null),
      address_subdistrict_name: Joi.string().allow('', null),
      address_village_code: Joi.string().allow('', null),
      address_village_name: Joi.string().allow('', null),
      address_rw: Joi.string().allow('', null),
      address_rt: Joi.string().allow('', null),
      address_street : Joi.string().allow('', null),
      relationship : Joi.string().allow('', null),
      travel_contact_date: Joi.date().allow('', null),
      trevel_is_went_abroad: Joi.boolean(),
      travel_visited_country: Joi.string().allow('', null),
      travel_is_went_other_city : Joi.boolean(),
      travel_visited_city: Joi.string().allow('', null),
      travel_depart_date: Joi.date().allow('', null),
      travel_return_date: Joi.date().allow('', null),
      travel_occupation: Joi.string().allow('', null),
      travel_address_office: Joi.string().allow('', null),
      travel_transportations: Joi.array(),
      home_contact_date: Joi.date().allow('', null),
      home_contact_durations: Joi.string().allow('', null),
      home_contact_days: Joi.string().allow('', null),
      home_activities: Joi.array(),
      is_contact_with_officer: Joi.boolean(),
      officer_protection_tools: Joi.array(),
      latest_report_history: historyPayload 
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  RequestPayload
}