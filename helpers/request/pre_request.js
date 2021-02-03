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

module.exports = {
  validateLocation
}