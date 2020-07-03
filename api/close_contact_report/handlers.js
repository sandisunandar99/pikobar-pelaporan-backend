const replyHelper = require('../helpers')
const Helper = require('../../helpers/custom')

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
         * POST /api/close-contacts/{closeContactId}/report
         * @param {*} request
         * @param {*} reply
         */
        async Create(request, reply){
            server.methods.services.closeContactReport.create(
                request.params.closeContactId,
                request.payload,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

                    server.methods.services.closeContactReportHistories.create(
                        result._id,
                        request.payload.latest_report_history,
                        (err, resultChild) => {
                            if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                            
                            const res = Object.assign(result, { latest_report_history: resultChild })
                            return reply(
                                constructCasesResponse(res, request)
                            ).code(200)
                        })
                })
        },
        /**
         * GET /api/close-contacts/{closeContactId}/report
         * @param {*} request
         * @param {*} reply
         */
        async Show(request, reply) {
            server.methods.services.closeContactReport.show(
                request.params.closeContactId,
                (err, item) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructCasesResponse(item, request)
                    ).code(200)
                })
        },
        /**
         * PUT /api/close-contacts/{closeContactId}/report
         * @param {*} request
         * @param {*} reply
         */
        async Update(request, reply){
            const currentHistory = request.pre.close_contact_report.latest_report_history
            const requestHistory = request.payload.latest_report_history
            const isDirty = Helper.isDirty(currentHistory, requestHistory)
            server.methods.services.closeContactReport.update(
                request.params.closeContactId,
                request.payload,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)

                    if (!requestHistory || !isDirty) {
                        const res = Object.assign(result, { latest_report_history: currentHistory })
                        return reply(
                            constructCasesResponse(res, request)
                        ).code(200)
                    } else {
                        server.methods.services.closeContactReportHistories.create(
                            result._id,
                            requestHistory,
                            (err, resultChild) => {
                                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                                
                                const res = Object.assign(result, { latest_report_history: resultChild })
                                return reply(
                                    constructCasesResponse(res, request)
                                ).code(200)
                            })
                    }
                })
        }
    }
}
