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
     * GET /api/dashboard/new-case
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
    },
  }
}