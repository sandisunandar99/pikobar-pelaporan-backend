const replyHelper = require('../helpers')
const {
  replyJson
} = require('../helpers')

const injectLastHistory = (server) => {
  return (request, reply) => {
    server.methods.services.inject.lastHistory(request,
      (err, result) => {
        replyJson(err, result, reply)
      })
  }
}

const injectRdtTest = (server) => {
  return (request, reply) => {
    server.methods.services.inject.injectRdt(
      request.payload,
      request.auth.credentials.user,
      request.pre,
      (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(
          constructLastHistoryResponse(result)
        ).code(200)
      }
    )
  }
}

module.exports = {
  injectLastHistory,injectRdtTest
}