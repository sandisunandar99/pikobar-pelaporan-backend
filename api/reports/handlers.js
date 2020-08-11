const replyHelper = require('../helpers')
module.exports = (server) => {
    function constructReportResponse(cases) {
        let jsonCases = {
            status: 200,
            message: "Success",
            data: cases
        }
        // return survey
        return jsonCases
    }

    return {
        /**
         * GET /api/reports/daily-report
         * @param {*} request
         * @param {*} reply
         */
        async DailyReport(request, reply){
            server.methods.services.reports.dailyReport(
                request.query,
                request.auth.credentials.user,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructReportResponse(result, request)
                ).code(200)
            })
        }
    }
}
