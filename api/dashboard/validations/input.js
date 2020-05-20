const Joi = require('joi')
const { validateOptions } = require('../../validations')
const _ = require('lodash')
// --------------------------------------------------
//    Schema - Input Validations
// --------------------------------------------------
const dashboardValidation = {
    query: {
        status: Joi.string().empty('', null).default('').description('search data by status')
    },
    options: validateOptions.options,
    failAction: validateOptions.failAction
}

module.exports = {
    dashboardValidation,
}