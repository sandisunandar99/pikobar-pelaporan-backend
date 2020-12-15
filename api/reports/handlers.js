const replyHelper = require('../helpers')
const {
  transformedXlsFor
} = require('../../helpers/reports/transformer')
const { requestIfSame } = require('../../helpers/request')
const { generateExcell } = require('../../helpers/export')

/**
 * GET /api/reports/daily-report
 * @param {*} request
 * @param {*} reply
*/
const dailyReport = (server) => {
  return async (request, reply) => {
    await requestIfSame(
      server, "reports", "dailyReport",
      request, reply
    )
  }
}

/**
  * GET /api/reports/daily-report-xls
  * @param {*} request
  * @param {*} reply
*/
const dailyReportXls = (server) => {
  return async (request, reply) => {
    const fullName = request.auth.credentials.user.fullname.replace(/\s/g, '-')
    const query = request.query
    const credentials = request.auth.credentials.user
    server.methods.services.reports.dailyReport(
      query, credentials,
      (err, result) => {
        const transformed = transformedXlsFor(result)
        const title = `Daily-Report`
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return generateExcell(transformed, title, fullName, reply)
      })
  }
}
module.exports = {
  dailyReport, dailyReportXls
}