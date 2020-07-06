const Joi = require('joi');
const {
  validateOptions
} = require('../../validations');

const RequestPayload = {
  payload: Joi.object().keys({
    name: Joi.string().required(),
    phone_number: Joi.string().allow(null, '').default(null),
    gender: Joi.string().required().valid('L', 'P'),
    age: Joi.number().allow(null, '').default(null),
    address: Joi.string().allow(null, '').default(null),
    relationship: Joi.string().allow(null, '').default(null),
    activity: Joi.string().allow(null, '').default(null)
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  RequestPayload
}