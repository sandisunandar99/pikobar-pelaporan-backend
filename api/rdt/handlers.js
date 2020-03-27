const replyHelper = require('../helpers')

module.exports = (server) => {
    function constructRdtResponse(rdt) {
        let jsonRdt = {
            status: 200,
            message: "Success",
            data: rdt
        }
        // return survey
        return jsonRdt
    }


    return {
        /**
         * GET /api/rdt
         * @param {*} request
         * @param {*} reply
         */
        async ListRdt(request, reply){
            let query = request.query

            server.methods.services.rdt.list(
                query, 
                request.auth.credentials.user,
                (err, result) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructRdtResponse(result,request)
                ).code(200)
            })
        },

        /**
         * POST /api/rdt
         * @param {*} request
         * @param {*} reply
         */
        async CreateRdt(request, reply){
            let payload = request.payload
            server.methods.services.rdt.create(
                payload,
                request.auth.credentials.user,
                request.pre.count_rdt,
                  (err, result) => {
                  if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                  return reply(
                      constructRdtResponse(result)
                  ).code(200)
                }
            )
        },

        /**
         * GET /api/rdt/{id}
         * @param {*} request
         * @param {*} reply
         */
        async GetRdtDetail(request, reply) {
            let id = request.params.id
            server.methods.services.rdt.getById(id, (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructRdtResponse(item)
                ).code(200)
            })
        },

        /**
         * GET /api/rdt/{id}/history
         * @param {*} request
         * @param {*} reply
         */
        async GetRdtHistory(request, reply) {
            server.methods.services.histories.getByRdt(
                request.params.id,
                (err, districs) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructRdtResponse(districs)
                    ).code(200)
                }
            )
        },

        /**
         * GET /api/rdt/{id}/last-history
         * @param {*} request
         * @param {*} reply
         */
        async GetRdtHistoryLast(request, reply) {
            server.methods.services.histories.getLastHistoryByIdRdt(
                request.params.id,
                (err, districs) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructRdtResponse(districs)
                    ).code(200)
                }
            )
        },

        /**
         * GET /api/rdt/summary
         * @param {*} request
         * @param {*} reply
         */
        async GetRdtSummary(request, reply) {
            server.methods.services.rdt.getSummary(
                request.query,
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructRdtResponse(item)
                ).code(200)
            })
        },


        /**
         * GET /api/rdt/summary-final
         * @param {*} request
         * @param {*} reply
         */
        async GetRdtSummaryFinal(request, reply) {
            server.methods.services.rdt.GetSummaryFinal(
                request.query,
                (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructRdtResponse(item)
                ).code(200)
            })
        },


        /**
         * PUT /api/rdt/{id}
         * @param {*} request
         * @param {*} reply
         */
        async UpdateRdt(request, reply){
            let payload = request.payload
            let id = request.params.id

            server.methods.services.rdt.update(
                id, 
                payload, 
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructRdtResponse(result)
                    ).code(200)
                }
            )
        },

        /**
         * DELETE /api/rdt/{id}
         * @param {*} request
         * @param {*} reply
         */
        async DeleteRdt(request, reply) {          
            server.methods.services.rdt.softDeleteRdt(
                request.pre.rdt,
                request.auth.credentials.user,
                request.payload,
                (err, item) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                     return reply(
                         constructRdtResponse(item)
                     ).code(202)
                })
        }

    }//end

}
