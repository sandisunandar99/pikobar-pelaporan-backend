const { HTTP } = require('../../helpers/constant')
const replyHelper = require('../helpers')
const Helper = require('../../helpers/custom')

module.exports = (server) => {
    return {
        /**
         * POST /api/close-contacts/{closeContactId}/report
         * @param {*} request
         * @param {*} reply
         */
        async CreateCloseContactReport(request, reply){
            server.methods.services.closeContactReport.create(
                request.params.closeContactId,
                request.auth.credentials.user,
                request.payload,
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)

                    server.methods.services.closeContactReportHistories.create(
                        result._id,
                        request.payload.latest_report_history,
                        (err, resultChild) => {
                            if (err) return replyHelper.errorResponse(reply, err)
                            
                            const res = Object.assign(result, { latest_report_history: resultChild })
                            return replyHelper.successResponse(reply, res, HTTP.CREATED)
                        })
                })
        },
        /**
         * GET /api/close-contacts/{closeContactId}/report
         * @param {*} request
         * @param {*} reply
         */
        async DetailCloseContactReport(request, reply) {
            server.methods.services.closeContactReport.show(
                request.params.closeContactId,
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)
                    return replyHelper.successResponse(reply, result, HTTP.OK)
                })
        },
        /**
         * PUT /api/close-contacts/{closeContactId}/report
         * @param {*} request
         * @param {*} reply
         */
        async UpdateCloseContactReport(request, reply){
            const currentHistory = request.pre.close_contact_report.latest_report_history
            const requestHistory = request.payload.latest_report_history
            const isDirty = Helper.isDirty(currentHistory, requestHistory)
            server.methods.services.closeContactReport.update(
                request.params.closeContactId,
                request.auth.credentials.user,
                request.payload,
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)

                    if (!requestHistory || !isDirty) {
                        const res = Object.assign(result, { latest_report_history: currentHistory })
                        return replyHelper.successResponse(reply, res, HTTP.OK)
                    } else {
                        server.methods.services.closeContactReportHistories.create(
                            result._id,
                            requestHistory,
                            (err, resultChild) => {
                                if (err) return replyHelper.errorResponse(reply, err)
                                
                                const res = Object.assign(result, { latest_report_history: resultChild })
                                return replyHelper.successResponse(reply, res, HTTP.OK)
                            })
                    }
                })
        }
    }
}
