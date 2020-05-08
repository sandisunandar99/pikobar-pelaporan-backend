const replyHelper = require('../helpers');

module.exports = (server) => {
    const dashboardResponse = (dashboard) => {
        let jsonDashboard = {
            status: 200,
            message: "Success",
            data: dashboard,
        }
        return jsonDashboard;
    };

    return {
        /**
         * GET /api/dashboard
         * @param {*} request
         * @param {*} reply
         */
        async countGenderAge(request, reply) {
            server.methods.services.dashboard.countByGenderAge(
                request.query,
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(dashboardResponse(result)).code(200);
                }
            )
        },
        /**
         * GET /api/dashboard
         * @param {*} request
         * @param {*} reply
         */
        async countOdp(request, reply) {
            server.methods.services.dashboard.countByOdp(
                request.query,
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(dashboardResponse(result)).code(200);
                }
            )
        },
        /**
         * GET /api/dashboard
         * @param {*} request
         * @param {*} reply
         */
        async countPdp(request, reply) {
            server.methods.services.dashboard.countByPdp(
                request.query,
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(dashboardResponse(result)).code(200);
                }
            )
        },
        /**
         * GET /api/dashboard
         * @param {*} request
         * @param {*} reply
         */
        async countOtg(request, reply) {
            server.methods.services.dashboard.countByOtg(
                request.query,
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(dashboardResponse(result)).code(200);
                }
            )
        },
        /**
         * GET /api/dashboard/chart-confirm
         * @param {*} request
         * @param {*} reply
         */
        async countByConfirm(request, reply) {
            server.methods.services.dashboard.countByConfirm(
                request.query,
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(dashboardResponse(result)).code(200);
                }
            )
        },
        /**
         * GET /api/dashboard/chart-confirm
         * @param {*} request
         * @param {*} reply
         */
        async tabelAggregateCriteria(request, reply) {
            server.methods.services.dashboard.summaryAggregateByDinkes(
                request.query,
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(dashboardResponse(result)).code(200);
                }
            )
        },

    } //end
}