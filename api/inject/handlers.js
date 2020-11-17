const replyHelper = require('../helpers')
const { replyJson } = require('../helpers')
const {payloadPreSame} = require('../../helpers/request')

const injectLastHistory = (server) => {
  return (request, reply) => {
    server.methods.services.inject.lastHistory(request,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const injectRdtTest = (server) => {
  return async (request, reply) => {
    await payloadPreSame(server, "inject", "injectRdt", request, reply)
  }
}

module.exports = {
  injectLastHistory,injectRdtTest
}