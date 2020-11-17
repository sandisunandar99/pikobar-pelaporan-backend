const replyHelper = require('../helpers')
const { replyJson } = require('../helpers')

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
    server.methods.services.inject.injectRdt(
      request.payload,
      request.auth.credentials.user,
      request.pre,
      (err, result) => {
         replyJson(err, result, reply)
      }
    )
  }
}

module.exports = {
  injectLastHistory,injectRdtTest
}