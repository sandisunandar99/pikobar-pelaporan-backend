const consts = require('../../../helpers/constant')
const Joi = require('joi')
const {
  validateOptions
} = require('../../validations')

const RequestPayload = {
  payload: Joi.object().keys({
    name: Joi.string().required(),
    phone_number: Joi.string().allow(null, ''),
    gender : Joi.string().valid(consts.GENDER.MALE, consts.GENDER.FEMALE),
    age: Joi.number().allow(null, ''),
    address: Joi.string().allow(null, ''),
    relationship: Joi.string().allow(null, ''),
    activity: Joi.string().allow(null, '')
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  RequestPayload
}