const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
const _ = require('lodash')
const { label, messages } = require('../../../helpers/casesheet/casesheetconfig.json')

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

const CaseVerifyPayload = Joi.object().keys({
    verified_status: Joi.string().valid('pending','verified','declined').required(),
    verified_comment: Joi.string().allow('', null).optional()
})

const CaseTransferPayload = Joi.object().keys({
    transfer_status: Joi.string().valid('pending','transferred','declined').required(),
    transfer_comment: Joi.string().allow('', null).optional(),
    transfer_to_unit_id: Joi.string().allow('', null).optional(),
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
        sort: Joi.string().empty('', 'desc').default('{createdAt:"desc"}').description('sorting by create date'),
        address_village_code: Joi.string().empty('', null).default('').description('search data by Keluarahan/Desa'),
        address_subdistrict_code: Joi.string().empty('', null).default('').description('search data by Kecamatan'),
        address_district_code: Joi.string().empty('', null).default('').description('search data by Case name'),
        name_case_related: Joi.string().empty('', null).default('').description('search data by Case name'),
        search: Joi.string().empty('', null).default('').description('search data by Case name'),
        status: Joi.string().empty('', null).default('').description('search data by status'),
        final_result: Joi.string().empty('', null).default('').description('search data by final_result'),
        start_date: Joi.string().empty('', null).default('').description('search data by test date'),
        end_date: Joi.string().empty('', null).default('').description('search data by test date'),
        author: Joi.string().empty('', null).default('').description('filter by author'),
        verified_status: Joi.string().empty('', null).default('').description('filter by verified status'),
        transfer_status: Joi.string().optional().valid('pending', 'declined', 'transferred').description('filter by transfer status')
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
    nik: Joi.string().allow('',null),
    id_case_related: Joi.string().allow('', null),
    name_case_related: Joi.string().allow('', null),
    name: Joi.string().required(),
    birth_date: Joi.date().allow('', null).error(() => `"${label.birth_date}" ${messages.invalid_date_format}`),
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
    phone_number: Joi.string().allow('', null),
    nationality: Joi.string().required(),
    nationality_name: Joi.string().allow('', null),
    occupation: Joi.string().allow('', null),
    stage: Joi.string().valid(['0', '1']).required().error(e => messages.invalid_status ),
    status: Joi.string().valid(['OTG', 'ODP', 'PDP', 'POSITIF']).required().error(e => messages.invalid_stage ),
    final_result: Joi.string().allow('', null),
    diagnosis: Joi.array(),
    diagnosis_other: Joi.string().allow('', null),
    is_went_abroad: Joi.boolean(),
    visited_country: Joi.string().allow('', null),
    return_date: Joi.date().allow('', null).error(() => `"${label.return_date}" ${messages.invalid_date_format}`),
    is_went_other_city: Joi.boolean(),
    visited_city: Joi.string().allow('', null),
    is_contact_with_positive: Joi.boolean(),
    history_notes: Joi.string().allow('', null),
    is_sample_taken: Joi.boolean(),
    report_source: Joi.string().allow('', null),
    first_symptom_date: Joi.date().allow('', null).error(() => `"${label.first_symptom_date}" ${messages.invalid_date_format}`),
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

const CaseVerifyPayloadValidations = Object.assign({
    payload: CaseVerifyPayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, CaseParamsValidations)

const CaseTransferPayloadValidations = Object.assign({
    payload: CaseTransferPayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, CaseParamsValidations)

module.exports = {
    CaseParamsValidations,
    CaseQueryValidations,
    CaseCreatePayloadValidations,
    CaseUpdatePayloadValidations,
    CaseDeletePayloadValidations,
    CaseImportPayloadValidations,
    caseSchemaValidation,
    CaseVerifyPayloadValidations,
    CaseTransferPayloadValidations
}