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
        async countGender(request, reply) {
            server.methods.services.dashboard.countByGender(
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
        async countODP(request, reply) {
            server.methods.services.dashboard.countByODP(
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
        async countPDP(request, reply) {
            server.methods.services.dashboard.countByPDP(
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
        async countOTG(request, reply) {
            server.methods.services.dashboard.countByOTG(
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