const replyHelper = require('../helpers')

module.exports = (server) => {
    function constructCasesResponse(cases) {
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
         * GET /api/cases
         * @param {*} request
         * @param {*} reply
         */
        async ListCase(request, reply){
            let query = request.query

            server.methods.services.cases.list(
                query, 
                request.auth.credentials.user,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(result,request)
                ).code(200)
            })
        },

        /**
         * POST /api/cases
         * @param {*} request
         * @param {*} reply
         */
        async CreateCase(request, reply){
            let payload = request.payload
            server.methods.services.cases.create(
                payload,
                request.auth.credentials.user,
                request.pre.count_case,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(result,request)
                ).code(200)
            })
        },

        /**
         * GET /api/cases/{id}
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseDetail(request, reply) {
            let id = request.params.id
            server.methods.services.cases.getById(id, (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        },

        /**
         * GET /api/cases/{id}/history
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseHistory(request, reply) {
            server.methods.services.histories.getByCase(
                request.params.id,
                (err, districs) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructCasesResponse(districs, request)
                    ).code(200)
                }
            )
        },

        /**
         * GET /api/cases/{id}/last-history
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseHistoryLast(request, reply) {
            server.methods.services.histories.getLastHistoryByIdCase(
                request.params.id,
                (err, districs) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructCasesResponse(districs, request)
                    ).code(200)
                }
            )
        },

        /**
         * GET /api/cases/summary
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseSummary(request, reply) {
            server.methods.services.cases.getSummary(
                request.query,
                request.auth.credentials.user,
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        },

        /**
         * GET /api/cases/summary-by-district
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseSummaryByDistrict(request, reply) {
            server.methods.services.cases.getSummaryByDistrict(
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        },


        /**
         * GET /api/cases/summary-final
         * @param {*} request
         * @param {*} reply
         */
        async GetCaseSummaryFinal(request, reply) {
            server.methods.services.cases.GetSummaryFinal(
                request.query,
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(item, request)
                ).code(200)
            })
        },


        /**
         * PUT /api/cases/{id}
         * @param {*} request
         * @param {*} reply
         */
        async UpdateCase(request, reply){
            let payload = request.payload
            let id = request.params.id

            server.methods.services.cases.update(id, payload, (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructCasesResponse(result, request)
                ).code(200)
            })
        },

        /**
         * DELETE /api/cases/{id}
         * @param {*} request
         * @param {*} reply
         */
        async DeleteCase(request, reply) {          
            server.methods.services.cases.softDeleteCase(
                request.pre.cases,
                request.auth.credentials.user,
                request.payload,
                (err, item) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                     return reply(
                         constructCasesResponse(item, request)
                     ).code(202)
                })
        }

    }//end

}
