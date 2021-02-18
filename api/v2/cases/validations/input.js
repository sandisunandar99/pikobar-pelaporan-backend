const consts = require('../../../../helpers/constant')
const Joi = require('joi')
const {
  validateOptions
} = require('../../../validations')

const RequestPayload = {
  payload: Joi.object().keys({
    interviewers_name: Joi.string().allow('', null),
    interviewers_phone_number: Joi.string().allow('', null),
    interview_date: Joi.date().allow('', null),
    nik: Joi.string().allow('', null),
    nik_note: Joi.string().allow('', null),
    name: Joi.string().allow('', null).required(),
    is_phone_number_exists: Joi.boolean(),
    phone_number: Joi.string().allow('', null),
    phone_number_note: Joi.string().allow('', null),
    birth_date : Joi.date().allow('', null),
    place_of_birth: Joi.string().allow('', null),
    age : Joi.number().required(),
    month : Joi.number().allow('', null),
    gender : Joi.string().allow('', null).valid(consts.GENDER.MALE, consts.GENDER.FEMALE),
    nationality: Joi.string().required(),
    nationality_name: Joi.string().allow('', null),
    is_patient_address_same: Joi.boolean(),
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
    address_street: Joi.string().allow('', null),
  }).unknown(),
  options: validateOptions.options,
  failAction: validateOptions.failAction,
}

// case sheet
const lang = require('../../../../helpers/dictionary/id.json')
const { CRITERIA } = require('../../../../helpers/constant')
const { refFinalResults } = require('../../../../helpers/cases/sheet/reference')
const enumCriterian = [
  CRITERIA.CLOSE,
  CRITERIA.CONF,
  CRITERIA.PROB,
  CRITERIA.SUS,
]
const enumFinalResult = refFinalResults.map(x => x.value.toString())
const invalidDate = (key) => {
  return `"${lang[key]}" ${lang.messages.invalid_date_format}`
}
const requiredIf = (value) => {
  return {
    is: Joi.valid(...value),
    then: Joi.required(),
    otherwise: Joi.allow('', null),
  }
}

const CaseSheetRequest = Joi.object().options({ abortEarly: false }).keys({
  interviewers_name: Joi.string().allow('', null),
  interviewers_phone_number: Joi.string().allow('', null),
  interview_date: Joi.date().allow('', null).error(() => invalidDate('interview_date')),
  nik: Joi.string().length(16).required(),
  phone_number: Joi.string().allow('', null),
  note_phone_number: Joi.string().when('phone_number', requiredIf(['', '-', null])),
  name: Joi.string().required(),
  name_parents: Joi.string().allow('', null),
  place_of_birth: Joi.string().allow('', null),
  birth_date: Joi.date().required().error((e) => {
    let err =  e
    if (e.length) {
      switch (e[0].type) {
        case 'date.base':
          err = invalidDate('birth_date')
          break;
        default:
      }
    }
    return err
  }),
  age: Joi.number().allow(null),
  month: Joi.number().allow(null),
  gender: Joi.string().required(),
  address_district_code: Joi.string().required(),
  address_district_name: Joi.string().required(),
  address_subdistrict_code: Joi.string().required(),
  address_subdistrict_name: Joi.string().required(),
  address_village_code: Joi.string().required(),
  address_village_name: Joi.string().required(),
  rt: Joi.number().required(),
  rw: Joi.number().required(),
  address_street: Joi.string().required(),
  occupation: Joi.string().allow('', null),
  office_address: Joi.string().allow('', null),
  nationality: Joi.string().required(),
  nationality_name: Joi.string().allow('', null),
  income: Joi.number().allow('', null),
  current_location_type: Joi.string().required(),
  current_location_district_code: Joi.string().allow('', null),
  current_location_subdistrict_code: Joi.string().allow('', null),
  current_location_village_code: Joi.string().allow('', null),
  current_location_address: Joi.string().allow('', null),
  there_are_symptoms: Joi.boolean().required(),
  first_symptom_date: Joi.date().allow('', null).error(() => invalidDate('first_symptom_date')),
  diagnosis: Joi.array(),
  diagnosis_other: Joi.string().allow('', null),
  diseases: Joi.array(),
  diseases_other: Joi.string().allow('', null),
  diagnosis_ards: Joi.number().required(),
  diagnosis_pneumonia: Joi.number().required(),
  other_diagnosis: Joi.string().allow('', null),
  is_other_diagnosisr_respiratory_disease: Joi.boolean(),
  other_diagnosisr_respiratory_disease: Joi.string().allow('', null),
  physical_check_temperature: Joi.number().allow('', null),
  physical_check_blood_pressure: Joi.number().allow('', null),
  physical_check_pulse: Joi.number().allow('', null),
  physical_check_respiration: Joi.number().allow('', null),
  physical_check_height: Joi.number().allow('', null),
  physical_check_weight: Joi.number().allow('', null),
  pysichal_activity: Joi.number().allow('', null),
  smoking: Joi.number().allow('', null),
  consume_alcohol: Joi.number().allow('', null),
  status: Joi.string().required().valid(enumCriterian),
  // final_result: Joi.string().required().valid(enumFinalResult),
  final_result: Joi.string().required()
  .when('status', { is: Joi.valid(CRITERIA.CONF, CRITERIA.PROB), then: Joi.valid('1', '2', '4')})
  .when('status', { is: Joi.valid(CRITERIA.CLOSE, CRITERIA.SUS), then: Joi.valid('3', '5')}),
  last_date_status_patient: Joi.date().allow('', null).error(() => invalidDate('last_date_status_patient')),
  transmission_type: Joi.number().when('status', requiredIf([CRITERIA.CONF])),
  cluster_type: Joi.number().when('status', requiredIf([CRITERIA.CONF])),
  cluster_other: Joi.string().allow('', null),
}).unknown()

module.exports = {
  CaseSheetRequest,
  RequestPayload,
}
