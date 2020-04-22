const Joi = require('joi');
const {
  validateOptions,
  HeadersPayLoad
} = require('../../validations');

// --------------------------------------------------
//    Config - Input Validations
// --------------------------------------------------

const LoginPayload = {
  payload: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
};

const RegisterPayload = {
  payload: Joi.object().keys({
    fullname: Joi.string().required().allow(null, '').default('null'),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    name_district_city: Joi.string().required().allow(null, '').default('null'),
    code_district_city: Joi.number().required().allow(null, '').default('null'),
    phone_number: Joi.string().required().allow(null, '').default('null'),
    address_street: Joi.string().required().allow(null, '').default('null'),
    address_subdistrict_code: Joi.string().required().allow(null, '').default('null'),
    address_subdistrict_name: Joi.string().required().allow(null, '').default('null'),
    address_village_code: Joi.string().required().allow(null, '').default('null'),
    address_village_name: Joi.string().required().allow(null, '').default('null')
  }),
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const UserQueryValidations = {
  query: {
    limit: Joi.number().integer().empty('', 10).default(10).description('limit result set'),
    offset: Joi.number().integer().default(0).description('number of record to skip'),
    page: Joi.number().integer().empty('', 1).default(1).description('number of page'),
    sort: Joi.string().empty('', 'desc').default('desc').description('sorting by create date'),
    search: Joi.string().empty('', null).default('').description('search data by Case name')
  },
  options: validateOptions.options,
  failAction: validateOptions.failAction
}

const UpdatePayload = {
  headers: HeadersPayLoad,
  payload: Joi.object().keys({
    fullname: Joi.string(),
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required(),
    role: Joi.string(),
    name_district_city: Joi.string(),
    code_district_city: Joi.number()
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
  UpdatePayload,
  UserQueryValidations
}