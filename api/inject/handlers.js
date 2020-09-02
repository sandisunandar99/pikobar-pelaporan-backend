const replyHelper = require('../helpers')

module.exports = (server) => {
  function constructLastHistoryResponse(last_history) {
    let jsonLastHistory = {
      status: 200,
      message: "Success",
      data: last_history
    }
    return jsonLastHistory
  }

  return {
    /**
     * GET /api/inject/last-history
     * @param {*} request
     * @param {*} reply
     */
    async injectLastHistory(request, reply) {
      server.methods.services.inject.lastHistory(request, (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(
          constructLastHistoryResponse(result, request)
        ).code(200)
      }
      )
    },
  }
}