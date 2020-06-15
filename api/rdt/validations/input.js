const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
const _ = require('lodash')

// --------------------------------------------------
//    Schema - Input Validations
// --------------------------------------------------


// --------------------------------------------------
//    Config - Input Validations
// --------------------------------------------------
const RdtQueryValidations = {
    query: {
        limit: Joi.number().integer().default(10).description('limit result set'),
        offset: Joi.number().integer().default(0).description('number of record to skip'),
        page: Joi.number().integer().default(0).description('number of page'),
        sort: Joi.string().empty('', 'desc').default('{createdAt:"desc"}').description('sorting by create date'),
        address_district_code: Joi.string().empty('', null).default('').description('search data by survey name'),
        category: Joi.string().empty('', null).default('').description('search by category'),
        final_result: Joi.string().empty('', null).default('').description('search by final_result'),
        mechanism: Joi.string().empty('', null).default('').description('search by mechanism'),
        test_method: Joi.string().empty('', null).default('').description('search by test_method'),
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

module.exports = {
    RdtQueryValidations,
    rdtSearchValidation
}