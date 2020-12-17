const { requestIfSame } = require('../../helpers/request')

const summaryInputTest = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "dashboard", "summaryInputTest",
      request, reply
    )
  }
}

const summaryTestResult = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "dashboard", "summaryTestResult",
      request, reply
    )
  }
}

const summaryTestResultGender = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "dashboard", "summaryGender",
      request, reply
    )
  }
}

const summaryTestResultAge = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "dashboard", "summaryAge",
      request, reply
    )
  }
}

module.exports = {
  summaryInputTest, summaryTestResult, summaryTestResultGender,
  summaryTestResultAge
}