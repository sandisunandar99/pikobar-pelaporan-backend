const { constructErrorResponse } = require('../../api/helpers')

const validateLocation = (request, reply, message) => {
  const { address_district_code } = request.payload
  const { code_district_city } = request.auth.credentials.user
  if (address_district_code === code_district_city) {
    return reply(code_district_city)
  } else {
    return reply({
      status: 422,
      message: message,
      data: null
    }).code(422).takeover()
  }

}

const handlerErrorResult = (err, result, message, reply) => {
  if (err) {
    return reply(constructErrorResponse(err)).code(422).takeover()
  }

  if (!result) {
    return reply({
      status: 422,
      message,
      data: null
    }).code(422).takeover()
  }

  return reply(result)
}

module.exports = {
  validateLocation, handlerErrorResult
}