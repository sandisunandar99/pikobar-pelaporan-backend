const { HTTP } = require('../../helpers/constant')
const replyHelper = require('../helpers')
module.exports = (server) => {
    return {
        /**
         * GET /api/cases/{caseId}/close-contacts
         * @param {*} request
         * @param {*} reply
         */
        async List(request, reply){
            server.methods.services.closeContacts.index(
                request.params.caseId, 
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)
                    return replyHelper.successResponse(reply, result, HTTP.OK)
                })
        },
        /**
         * POST /api/cases/{id}/close-contacts
         * @param {*} request
         * @param {*} reply
         */
        async Create(request, reply){
            server.methods.services.closeContacts.create(
                request.params.caseId,
                request.payload,
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)
                    return replyHelper.successResponse(reply, result, HTTP.CREATED)
                })
        },
        /**
         * POST /api/cases/{id}/close-contacts-with-report
         * @param {*} request
         * @param {*} reply
         */
        async CreateWithReport(request, reply){
            server.methods.services.closeContacts.create(
                request.params.caseId,
                request.payload,
                (err, closeContact) => {
                    if (err) return replyHelper.errorResponse(reply, err)

                    server.methods.services.closeContactReport.create(
                        closeContact._id,
                        request.payload,
                        (err, report) => {
                            if (err) return replyHelper.errorResponse(reply, err)

                            server.methods.services.closeContactReportHistories.create(
                                report._id,
                                request.payload.latest_report_history,
                                (err, history) => {
                                    if (err) return replyHelper.errorResponse(reply, err)

                                    const res = Object.assign(report, { latest_report_history: history })
                                    return replyHelper.successResponse(reply, res, HTTP.CREATED)
                                })
                        })
                })
        },
        /**
         * DELETE /api/cases/{caseId}/close-contacts/{id}
         * @param {*} request
         * @param {*} reply
         */
        async Delete(request, reply) {          
            server.methods.services.closeContacts.delete(
                request.params.id,
                request.auth.credentials.user,
                request.payload,
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)
                    return replyHelper.successResponse(reply, result, HTTP.OK)
                })
        },
    }
}
