const replyHelper = require('../helpers')
module.exports = (server) => {
    function constructReportResponse(report) {
        let jsonReport = {
            status: 200,
            message: "Success",
            data: report
        }
        // return report
        return jsonReport
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
