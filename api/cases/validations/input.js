const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
const _ = require('lodash')

// --------------------------------------------------
//    Schema - Input Validations
// --------------------------------------------------

const CaseCreatePayload = Joi.object().keys({

})

const CaseUpdatePayload = Joi.object().keys({
    Case_name: Joi.string().optional(),
    category: Joi.string().optional(),
    using_for: Joi.string().optional(),
    description: Joi.string().optional(),
    introduction: Joi.string().optional(),
    periode_start: Joi.date().optional(),
    periode_end: Joi.date().optional(),
    respondent_target: Joi.number().optional(),
    status: Joi.string().optional()
})

const CaseParamsValidations = {
    params: {
        id: Joi.string().required()
    }
}


// --------------------------------------------------
//    Config - Input Validations
// --------------------------------------------------
const CaseQueryValidations = {
    query: {
        limit: Joi.number().integer().empty('', 10).default(10).description('limit result set'),
        offset: Joi.number().integer().default(0).description('number of record to skip'),
        page: Joi.number().integer().empty('', 1).default(1).description('number of page'),
        sort: Joi.string().empty('', 'desc').default('desc').description('sorting by create date'),
        address_village_code: Joi.string().empty('', null).default('').description('search data by Keluarahan/Desa'),
        address_subdistrict_code: Joi.string().empty('', null).default('').description('search data by Kecamatan'),
        address_district_code: Joi.string().empty('', null).default('').description('search data by Case name'),
        name_case_related: Joi.string().empty('', null).default('').description('search data by Case name'),
        search: Joi.string().empty('', null).default('').description('search data by Case name'),
        status: Joi.string().empty('', null).default('').description('search data by status'),
        final_result: Joi.string().empty('', null).default('').description('search data by final_result'),
        start_date: Joi.string().empty('', null).default('').description('search data by test date'),
        end_date: Joi.string().empty('', null).default('').description('search data by test date')
    },
    options: validateOptions.options,
    failAction: validateOptions.failAction
}


const CaseImportPayload = Joi.object().keys({
    file: Joi.any()
        .required()
        .description('xlsx file')
})

const caseSchemaValidation = Joi.object().options({ abortEarly: false }).keys({
    id_case_national: Joi.string().allow('', null),
    nik: Joi.string().required(),
    id_case_related: Joi.string().allow('', null),
    name_case_related: Joi.string().allow('', null),
    name: Joi.string().required(),
    birth_date: Joi.date().allow('', null),
    age: Joi.number().required(),
    gender: Joi.string().required(),
    address_street: Joi.string().allow('', null),
    address_village_code: Joi.string().required(),
    address_village_name: Joi.string().required(),
    address_subdistrict_code: Joi.string().required(),
    address_subdistrict_name: Joi.string().required(),
    address_district_code: Joi.string().required(),
    address_district_name: Joi.string().required(),
    office_address: Joi.string().allow('', null),
    phone_number: Joi.string().required(),
    nationality: Joi.string().required(),
    nationality_name: Joi.string().allow('', null),
    occupation: Joi.string().allow('', null),
    stage: Joi.string().required(),
    status: Joi.string().required(),
    final_result: Joi.string().required(),
    diagnosis: Joi.array(),
    diagnosis_other: Joi.string().allow('', null),
    is_went_abroad: Joi.boolean(),
    visited_country: Joi.string().allow('', null),
    return_date: Joi.date().allow('', null),
    is_went_other_city: Joi.boolean(),
    visited_city: Joi.string().allow('', null),
    is_contact_with_positive: Joi.boolean(),
    history_notes: Joi.string().allow('', null),
    is_sample_taken: Joi.boolean(),
    report_source: Joi.string().allow('', null),
    first_symptom_date: Joi.date().allow('', null),
    other_notes: Joi.string().allow('', null),
    current_location_type: Joi.string().required(),
    current_location_address: Joi.string().allow('', null),
    current_location_village_code: Joi.string().allow('', null),
    current_location_subdistrict_code: Joi.string().allow('', null),
    current_location_district_code: Joi.string().allow('', null)
}).unknown()


const CaseCreatePayloadValidations = {
    payload: CaseCreatePayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}


const CaseUpdatePayloadValidations = Object.assign({
    payload: CaseUpdatePayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, CaseParamsValidations)


const CaseDeletePayloadValidations = Object.assign({
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, CaseParamsValidations)

const CaseImportPayloadValidations = {
    payload: CaseImportPayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}

module.exports = {
    CaseParamsValidations,
    CaseQueryValidations,
    CaseCreatePayloadValidations,
    CaseUpdatePayloadValidations,
    CaseDeletePayloadValidations,
    CaseImportPayloadValidations,
    caseSchemaValidation
}