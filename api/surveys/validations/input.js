const Joi = require('joi')
const {validateOptions, HeadersPayLoad} = require('../../validations')
const _ = require('lodash')

// --------------------------------------------------
//    Schema - Input Validations
// --------------------------------------------------

const SurveyCreatePayload = Joi.object().keys({ 
    id: Joi.object().description('survei id'),
    author: Joi.object().keys({
        id: Joi.object().description('user id'),
        username: Joi.string().description('nama pembuat survei')
    }),
    survey_name: Joi.string().required().description('Nama survey'),
    category: Joi.string().description('Kategori survei'),
    using_for: Joi.string().description('Pengguna survei privat/public'),
    description: Joi.string().description('Penjelasan survei'),
    introduction: Joi.string().description('Teks pembukaan survei'),
    periode_start: Joi.date().required().description('Tanggal survei dimulai'),
    periode_end: Joi.date().required().description('Tanggal survei berakhir'),
    respondent_target: Joi.number().allow('', null).default(0).description('Target survei respondent'),
    respondent_input: Joi.number().allow('', null).default(0).description('Target survei respondent'),
    status: Joi.string().description('Status publikasi survei'),
    createdAt: Joi.date().iso().description('Tanggal survei dibuat'),
    updatedAt: Joi.date().iso().description('Tanggal survei terakhir di update')
})

const SurveyUpdatePayload = Joi.object().keys({
    id: Joi.object().description('survei id'),
    author: Joi.object().keys({
        id: Joi.object().description('user id'),
        username: Joi.string().description('nama pembuat survei')
    }),
    survey_name: Joi.string().required().description('Nama survey'),
    category: Joi.string().description('Kategori survei'),
    using_for: Joi.string().description('Pengguna survei privat/public'),
    description: Joi.string().description('Penjelasan survei'),
    introduction: Joi.string().description('Teks pembukaan survei'),
    periode_start: Joi.date().required().description('Tanggal survei dimulai'),
    periode_end: Joi.date().required().description('Tanggal survei berakhir'),
    respondent_target: Joi.number().allow('', null).default(0).description('Target survei respondent'),
    respondent_input: Joi.number().allow('', null).default(0).description('Target survei respondent'),
    status: Joi.string().description('Status publikasi survei'),
    createdAt: Joi.date().iso().description('Tanggal survei dibuat'),
    updatedAt: Joi.date().iso().description('Tanggal survei terakhir di update')
})


const SurveySoftDeletePayload = Joi.object().keys({
    status: Joi.string().description('Status publikasi survei')
})


const SurveyParamsValidations = {
    params: {
        id: Joi.string().required()
    }
}


// --------------------------------------------------
//    Config - Input Validations
// --------------------------------------------------

const SurveyQueryValidations = {
    query: {
        author: Joi.string().description('Filter berdasarkan pembuat survei'),
        status: Joi.string().description('Filter berdasarkan status survei'),
        category: Joi.string().description('Filter berdasarkan kategori survei'),
        using_for: Joi.string().description('Filter berdasarkan penggunaan survei'),
        limit: Joi.number().integer().empty('', 10).default(10).description('limit result set'),
        offset: Joi.number().integer().default(0).description('number of record to skip'),
        page: Joi.number().integer().empty('', 1).default(1).description('number of page'),
        sort: Joi.string().empty('', 'desc').default('desc').description('sorting by create date'),
        search: Joi.string().empty('', null).default('').description('search data by survey name')
    },
    options: validateOptions.options,
    failAction: validateOptions.failAction
}


const SurveyCreatePayloadValidations = {
    payload: SurveyCreatePayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}


const SurveyUpdatePayloadValidations = Object.assign({
    payload: SurveyUpdatePayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, SurveyParamsValidations)


const SurveySoftDeletePayloadValidations = Object.assign({
    payload: SurveySoftDeletePayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, SurveyParamsValidations)


const SurveyDeletePayloadValidations = Object.assign({
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, SurveyParamsValidations)

module.exports = {
    SurveyParamsValidations,
    SurveyQueryValidations,
    SurveyCreatePayloadValidations,
    SurveyUpdatePayloadValidations,
    SurveySoftDeletePayloadValidations,
    SurveyDeletePayloadValidations
}