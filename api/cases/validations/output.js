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

const CaseJSON = Joi.object().keys({
    _id: Joi.object(),
    id_case: Joi.string(),
    name: Joi.string(),
    age: Joi.number(),
    nik: Joi.number(),
    nationality: Joi.string(),
    nationality_name: Joi.string(),
    gender: Joi.string(),
    current_location_address: Joi.string(),
    address_district_name: Joi.string(),
    address_district_code: Joi.string(),
    stage: Joi.string(),
    status: Joi.string(),
    verified_status: Joi.string(),
    verified_comment: Joi.string().allow('',null),
    final_result: Joi.string(),
    delete_status: Joi.string(),
    deletedAt: Joi.date(),
    author: Joi.object(),
    last_history: Joi.object()
})


const SingleCaseOutputPayload = Joi.object().keys({ CaseJSON })

const ListCaseOutputPayload = Joi.object().keys({
    status: Joi.number().description('Code response'),
    message: Joi.string().description('Message response'),
    data: Joi.object().keys({
         cases: Joi.array().items(CaseJSON),
        _meta: Joi.object().description('meta data')
    })
})



// --------------------------------------------------
//    Config - Output Validations
// --------------------------------------------------

const ListCaseOutputValidationsConfig = {
    status: {
        200: ListCaseOutputPayload
    }
}

const CaseOnPostOutputValidationsConfig = _.merge({}, ErrorsOnPostOutputValidations, {
    status: {
        200: SingleCaseOutputPayload
    }
})

const CaseOnPutOutputValidationsConfig = _.merge({}, ErrorsOnPutOutputValidations, {
    status: {
        200: SingleCaseOutputPayload
    }
})

const CaseOnDeleteOutputValidationsConfig = _.merge({}, ErrorsOnDeleteOutputValidations, {
    status: {
        204: false
    }
})

const CaseOnGetOutputValidationsConfig = _.merge({}, ErrorsOnGetOutputValidations, {
    status: {
        200: SingleCaseOutputPayload
    }
})

module.exports = {
    ListCaseOutputValidationsConfig,
    ListCaseOutputPayload,
    CaseOnPostOutputValidationsConfig,
    SingleCaseOutputPayload,
    CaseOnPutOutputValidationsConfig,
    CaseOnDeleteOutputValidationsConfig,
    CaseOnGetOutputValidationsConfig
}