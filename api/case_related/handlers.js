const replyHelper = require('../helpers')
const { funcIfSame, requestIfSame } = require('../../helpers/request')

/**
 * GET /api/case-related
 * @param {*} request
 * @param {*} reply
**/

module.exports = (server) => {
  return {
    async caseRelatedList(request, reply) {
      await requestIfSame(
        server, 'case_related', 'list', request, reply
      )
    },
    async caseRelatedById(request, reply) {
      await funcIfSame(
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
  }
}
