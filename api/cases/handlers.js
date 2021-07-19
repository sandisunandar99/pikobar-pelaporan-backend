const { constructErrorResponse, replyJson } = require('../helpers')
const { generateExcell } = require('../../helpers/export')
const { queryIfSame, funcIfSame, requestIfSame } = require('../../helpers/request')

module.exports = (server) => {

  return {
    /**
     * GET /api/cases
     * @param {*} request
     * @param {*} reply
     */
    async ListCase(request, reply) {
      let query = request.query
      server.methods.services.cases.list(
        query,
        request.auth.credentials.user,
        (err, result) => replyJson(err, result, reply)
      )
    },
    /**
     * POST /api/cases
     * @param {*} request
     * @param {*} reply
     */
    async CreateCase(request, reply) {
      let payload = request.payload
      server.methods.services.cases.create(
        payload,
        request.auth.credentials.user,
        request.pre,
        (err, result) => replyJson(err, result, reply)
      )
    },
    /**
     * GET /api/cases/{id}
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseDetail(request, reply) {
      await funcIfSame(server, 'cases_other', 'getById', request, 'id', reply)
    },
    /**
     * GET /api/cases/{id}/history
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseHistory(request, reply) {
      await funcIfSame(server, 'histories', 'getByCase', request, 'id', reply)
    },
    /**
     * GET /api/cases/{id}/last-history
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseHistoryLast(request, reply) {
      await funcIfSame(server, 'histories', 'getLastHistoryByIdCase', request, 'id', reply)
    },
    /**
     * GET /api/cases/summary
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseSummary(request, reply) {
      await requestIfSame(server, 'cases_other', 'getSummary', request, reply)
    },
    /**
     * GET /api/cases/summary-by-district
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseSummaryByDistrict(request, reply) {
      server.methods.services.cases_other.getSummaryByDistrict(
        (err, item) => replyJson(err, item, reply)
      )
    },
    /**
     * GET /api/cases/summary-final
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseSummaryFinal(request, reply) {
      await requestIfSame(server, 'cases', 'GetSummaryFinal', request, reply)
    },
    /**
     * PUT /api/cases/{id}
     * @param {*} request
     * @param {*} reply
     */
    async UpdateCase(request, reply) {
      let pre = request.pre
      let payload = request.payload
      let id = request.params.id
      let author = request.auth.credentials.user
      server.methods.services.cases.update(id, pre, author, payload, (err, result) =>
      replyJson(err, result, reply)
      )
    },
    /**
     * DELETE /api/cases/{id}
     * @param {*} request
     * @param {*} reply
     */
    async DeleteCase(request, reply) {
      server.methods.services.cases_other.softDeleteCase(
        request.params.id,
        request.auth.credentials.user._id,
        (err, item) => replyJson(err, item, reply)
      )
    },
    /**
     * GET /api/cases
     * @param {*} request
     * @param {*} reply
     */
    async ListCaseExport(request, reply) {
      const query = request.query
      const { user } = request.auth.credentials
      const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
      server.methods.services.cases.listCaseExport(
        query, user,
        (err, result) => {
          if (err) return reply(constructErrorResponse(err)).code(422)
          const title = `Data-Kasus-`
          return generateExcell(result, title, fullName, reply)
        })
    },
    /**
     * GET /api/cases-listid
     * @param {*} request
     * @param {*} reply
     */
    async GetIdCase(request, reply) {
      await queryIfSame(server, 'cases_other', 'getIdCase', request, reply)
    },
    /**
     * GET /api/cases-by-nik/{nik}
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseDetailByNik(request, reply) {
      await funcIfSame(server, 'cases_other', 'getByNik', request, 'nik', reply)
    },
    /**
     * GET /api/cases-healthcheck
     * @param {*} request
     * @param {*} reply
     */
    async HealthCheck(request, reply) {
      await queryIfSame(server, 'cases_other', 'healthcheck', request, reply)
    },
    /**
     * GET /api/cases/{id}/verifications
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseVerifications(request, reply) {
      await funcIfSame(server, 'casesVerifications', 'get', request, 'id', reply)
    },
    /**
     * PUT /api/cases/{id}/verifications
     * @param {*} request
     * @param {*} reply
     */
    async CreateCaseVerification(request, reply) {
      let payload = request.payload
      let id = request.params.id
      let author = request.auth.credentials.user

      server.methods.services.casesVerifications.create(
        id,
        author,
        request.pre.count_case,
        payload,
        (err, result) => replyJson(err, result, reply))
    },
    /**
     * GET /api/cases/summary-verification
     * @param {*} request
     * @param {*} reply
     */
    async GetCaseSummaryVerification(request, reply) {
      await requestIfSame(server, 'cases_other', 'getSummaryVerification', request, reply)
    }
  }
}
