const Joi = require('joi')

const {
    ErrorsWithAuthOutputValidations,
    ErrorsOnPostOutputValidations,
    ErrorsOnGetOutputValidations,
    ErrorsOnPutOutputValidations,
    ErrorsOnDeleteOutputValidations
} = require('../../validations')

const _ = require('lodash')

// --------------------------------------------------
//    Schema - Output Validations
// --------------------------------------------------

const SurveyJSON = Joi.object().keys({
    id: Joi.object().description('survei id'),
    author: Joi.object().keys({
        id: Joi.object().description('user id'),
        username: Joi.string().description('nama pembuat survei')
    }),
    survey_name:Joi.string().required().description('Nama survey'),
    category:Joi.string().description('Kategori survei'),
    using_for:Joi.string().description('Pengguna survei privat/public'),
    description: Joi.string().description('Penjelasan survei'),
    introduction: Joi.string().description('Teks pembukaan survei'),
    periode_start:Joi.date().iso().required().description('Tanggal survei dimulai'),
    periode_end: Joi.date().iso().required().description('Tanggal survei berakhir'),
    respondent_target: Joi.number().allow('', null).default(0).description('Target survei respondent'),
    respondent_input: Joi.number().allow('', null).default(0).description('Target survei respondent'),
    status: Joi.string().description('Status publikasi survei'),
    count_question: Joi.number().description('banyak nya pertanyaan pada survey tersebut'),
    createdAt: Joi.date().iso().description('Tanggal survei dibuat'),
    updatedAt: Joi.date().iso().description('Tanggal survei terakhir di update'),
    deletedAt: Joi.date().iso().description('Tanggal survei di hapus'),
    url: Joi.string().description('URL untuk di copas untuk client')
})


const SingleSurveyOutputPayload = Joi.object().keys({SurveyJSON})

const ListSurveyOutputPayload = Joi.object().keys({
    status: Joi.number().description('Code response'),
    message: Joi.string().description('Message response'),
    data: Joi.array().items(SurveyJSON),
    _metaData: Joi.object().description('meta data')
})


// --------------------------------------------------
//    Config - Output Validations
// --------------------------------------------------

const ListSurveyOutputValidationsConfig = {
    status: {
        200: ListSurveyOutputPayload 
    }
}

const SurveyOnPostOutputValidationsConfig = _.merge({}, ErrorsOnPostOutputValidations, {
    status: {
        200: SingleSurveyOutputPayload
    }
})

const SurveyOnPutOutputValidationsConfig = _.merge({}, ErrorsOnPutOutputValidations, {
    status: {
        200: SingleSurveyOutputPayload
    }
})

const SurveyOnDeleteOutputValidationsConfig = _.merge({}, ErrorsOnDeleteOutputValidations, {
    status: {
        204: false
    }
})

const SurveyOnGetOutputValidationsConfig = _.merge({}, ErrorsOnGetOutputValidations, {
    status: {
        200: SingleSurveyOutputPayload
    }
})

module.exports ={
    ListSurveyOutputValidationsConfig,
    ListSurveyOutputPayload,
    SurveyOnPostOutputValidationsConfig,
    SingleSurveyOutputPayload,
    SurveyOnPutOutputValidationsConfig,
    SurveyOnDeleteOutputValidationsConfig,
    SurveyOnGetOutputValidationsConfig
}