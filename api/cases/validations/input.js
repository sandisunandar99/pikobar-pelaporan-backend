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
    CaseImportPayloadValidations
}