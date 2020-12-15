const { requestIfSame } = require('../../helpers/request')

const summaryInputTest = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "dashboard", "summaryInputTest",
      request, reply
    )
  }
}

module.exports = {
  summaryInputTest
}