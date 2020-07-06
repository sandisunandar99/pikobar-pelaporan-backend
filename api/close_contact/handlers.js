const replyHelper = require('../helpers')
module.exports = (server) => {
    function constructCasesResponse(cases) {
        let jsonCases = {
            status: 200,
            message: "Success",
            data: cases
        }
        return jsonCases
    }

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
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructCasesResponse(result,request)
                    ).code(200)
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
                (errA, resultA) => {
                    if (errA) return reply(replyHelper.constructErrorResponse(errA)).code(422)

                    return reply(
                        constructCasesResponse(resultA,request)
                    ).code(200)
                })
        },
        /**
         * POST /api/cases/{id}/close-contacts?is_reported=true
         * @param {*} request
         * @param {*} reply
         */
        async CreateWithReport(request, reply){
            server.methods.services.closeContacts.create(
                request.params.caseId,
                request.payload,
                (err, closeContact) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

                    server.methods.services.closeContactReport.create(
                        closeContact._id,
                        request.payload,
                        (err, report) => {
                            if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        
                            server.methods.services.closeContactReportHistories.create(
                                report._id,
                                request.payload.latest_report_history,
                                (err, history) => {
                                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                                    
                                    const res = Object.assign(report, { latest_report_history: history })
                                    return reply(
                                        constructCasesResponse(res, request)
                                    ).code(200)
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
                (err, item) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                     return reply(
                         constructCasesResponse(item, request)
                     ).code(202)
                })
        },
    }
}
