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
    id_case: Joi.string().allow('', null),
    name: Joi.string().allow('', null),
    age: Joi.number().allow('', null),
    nik: Joi.string().allow('',null),
    nationality: Joi.string().allow('', null),
    nationality_name: Joi.string().allow('', null),
    gender: Joi.string().allow('', null),
    current_location_address: Joi.string().allow('', null),
    address_district_name: Joi.string().allow('', null),
    address_district_code: Joi.string().allow('', null),
    phone_number: Joi.string().allow('', null),
    stage: Joi.string().allow('', null),
    status: Joi.string().allow('', null),
    verified_status: Joi.string().allow('', null),
    verified_comment: Joi.string().allow('',null),
    final_result: Joi.string().allow('', null),
    delete_status: Joi.string().allow('', null),
    deletedAt: Joi.date().allow('', null),
    author: Joi.object(),
    last_history: Joi.object(),
    is_test_masif: Joi.boolean().allow('',null),
    createdAt: Joi.date().allow('', null),
    updatedAt: Joi.date().allow('', null)
})


const SingleCaseOutputPayload = Joi.object().keys({ CaseJSON })

const ListCaseOutputPayload = Joi.object().keys({
    status: Joi.number().description('Code response'),
    message: Joi.string().description('Message response'),
    data: Joi.object().keys({
         cases: Joi.array().items(CaseJSON),
        _meta: Joi.object().description('meta data')
    }).allow(null,'')
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