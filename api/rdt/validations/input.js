const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
const _ = require('lodash')
const {requiredIf} = require('../../v2/cases/validations/input')

// --------------------------------------------------
//    Schema - Input Validations
// --------------------------------------------------


// --------------------------------------------------
//    Config - Input Validations
// --------------------------------------------------
const RdtQueryValidations = {
    query: {
        limit: Joi.number().integer().empty('', 10).default(10).description('limit result set'),
        offset: Joi.number().integer().default(0).description('number of record to skip'),
        page: Joi.number().integer().empty('', 1).default(1).description('number of page'),
        sort: Joi.string().description('sorting data'),
        address_district_code: Joi.string().empty('', null).default('').description('search data by survey name'),
        category: Joi.string().empty('', null).default('').description('search by category'),
        final_result: Joi.string().empty('', null).default('').description('search by final_result'),
        mechanism: Joi.string().empty('', null).default('').description('search by mechanism'),
        test_method: Joi.string().empty('', null).default('').description('search by test_method'),
        tool_tester: Joi.string().empty('', null).default('').description('search by tool_tester'),
        test_address_district_code: Joi.string().empty('', null).default('').description('search by test_address_district_code'),
        search: Joi.string().empty('', null).default('').description('search data'),
        start_date: Joi.string().empty('', null).default('').description('search data by test date'),
        end_date: Joi.string().empty('', null).default('').description('search data by test date')
    },
    options: validateOptions.options,
    failAction: validateOptions.failAction
}

const rdtSearchValidation = {
    query:{
        search: Joi.string().allow(null, "").empty("", null).default('aa').description('search data'),
        address_district_code: Joi.string().required().description('location'),
    },
    options: validateOptions.options,
    failAction: validateOptions.failAction
}

const RdtsheetRequest = Joi.object().options({ abortEarly: false }).keys({
  target: Joi.string().required(),
  category: Joi.string().required(),
  name: Joi.string().required(),
  nik: Joi.string().length(16).required(),
  phone_number: Joi.string().allow('', null),
  gender: Joi.string().required(),
  age: Joi.number().allow('',null),
  birth_date: Joi.date().required(),
  address_district_code: Joi.string().required(),
  address_district_name: Joi.string().required(),
  address_subdistrict_code: Joi.string().required(),
  address_subdistrict_name: Joi.string().required(),
  address_village_code: Joi.string().required(),
  address_village_name: Joi.string().required(),
  address_street: Joi.string().required(),
  nationality: Joi.string().required(),
  nationality_name: Joi.string().allow('', null),
  tool_tester: Joi.string().required(),
  test_method: Joi.string().allow('',null),
  test_location_type: Joi.string().required(),
  test_location: Joi.string().required(),
  final_result: Joi.string().required(),
  swab_to: Joi.number().required(),
  test_date: Joi.date().required(),
  test_note: Joi.string().allow('',null),
  note_nik: Joi.string().when('nik', requiredIf(['', '-', null])),
  note_phone_number: Joi.string().when('phone_number', requiredIf(['', '-', null])),
  }).unknown()

module.exports = {
  RdtsheetRequest,
  RdtQueryValidations,
  rdtSearchValidation
}