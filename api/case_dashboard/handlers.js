'use strict'
const replyHelper = require('../helpers')

module.exports = (server) => {
  const dashboardResponse = (caseData) => {
    let caseDashboard = {
      status: 200,
      message: "Success",
      data: caseData,
    }
    return caseDashboard;
  };

  return {
    /**
     * /api/dashboard/v2
     * @param {*} request
     * @param {*} reply
     */
    async countSectionTop(request, reply) {
      server.methods.services.case_dashboard.countSectionTop(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(dashboardResponse(result)).code(200);
        }
      )
    },async countSummary(request, reply) {
      server.methods.services.case_dashboard.countSummary(
        request.query,
        request.auth.credentials.user,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(dashboardResponse(result)).code(200);
        }
      )
    },
  }
}