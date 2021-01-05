const replyHelper = require('../helpers')
const { funcIfSame } = require('../../helpers/request')

module.exports = (server) => {

  return {
    /**
     * GET /api/case-related
     * @param {*} request
     * @param {*} reply
     */
    async caseRelatedList(request, reply) {
      server.methods.services.case_related.list(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422);
          return reply(replyHelper.successResponse(result)).code(200);
        }
      )
    },
    async caseRelatedById(request, reply) {
      return await funcIfSame(
        server, "case_related", "getById",
        request, "id_case", reply
      )
    },
    async caseRelatedSync(request, reply) {
      server.methods.services.case_related.sync(
        server.methods.services,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422);
          return reply(replyHelper.successResponse(result, request)).code(200);
        }
      )
    },
  } //end
}
