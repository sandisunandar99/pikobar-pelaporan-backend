const Joi = require('joi')
const {validateOptions, HeadersPayLoad} = require('../../validations')

// --------------------------------------------------
//    Config - Input Validations
// --------------------------------------------------

// method menggunakan email
// const LoginPayload = {
//   payload: Joi.object().keys({
//     user: Joi.object().keys({
//       email: Joi.string().email().required(),
//       password: Joi.string().required()
//     })
//   }),
//   options: validateOptions.options,
//   failAction: validateOptions.failAction
// }

// method menggunakan username 
const LoginPayload = {
  payload: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required()
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const RegisterPayload = {
  payload: Joi.object().keys({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
      code_district_city: Joi.string().required().allow(null, '').default('null')
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const UpdatePayload = {
  headers: HeadersPayLoad,
  payload: Joi.object().keys({
      username: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().allow(''),
      role: Joi.string().required(),
      code_district_city: Joi.string().required().empty('', null).default(null)
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const GetCurrentPayload = {
  headers: HeadersPayLoad,
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

module.exports = {
  GetCurrentPayload,
  LoginPayload,
  RegisterPayload,
  UpdatePayload
}
