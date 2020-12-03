const { customResponse } = require('../api/helpers')
const conditionPreReq = (result, name, reply, message) => {
  if (result) {
    if (result[name].length === 0) {
      return reply(customResponse(200, message, null)).code(200).takeover()
    } else {
      return reply()
    }
  } else {
    return reply(customResponse(200, message, null)).code(200).takeover()
  }
}

module.exports = { conditionPreReq }