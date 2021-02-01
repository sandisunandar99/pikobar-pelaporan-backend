const { replyJson } = require('../helpers');

module.exports = (server) => {
  return {
  /**
   * GET /api/search
   * @param {*} request
   * @param {*} reply
   */
    async getCases(request, reply) {
      server.methods.services.search.getCases(
        request.query,
        (err, result) => replyJson(err, result, reply)
      )
    }
  }
}