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
                request.pre,
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
                request.pre.cases,
                request.auth.credentials.user,
                (err, item) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                     return reply(
                         constructRdtResponse(item)
                     ).code(202)
                })
        },


        /**
         * DELETE /api/rdt/{id}
         * @param {*} request
         * @param {*} reply
         */
        async GetListIdCase(request, reply) {
            let query = request.query
            server.methods.services.rdt.FormSelectIdCase(
                query,
                request.auth.credentials.user,
                request.pre.data_pendaftaran,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructRdtResponse(result, request)
                    ).code(200)
            })
        },

        /**
         * GET /api/rdt/summary-by-cities
         * @param {*} request
         * @param {*} reply
         */
        async GetRdtSummaryByCities(request, reply) {
              let query = request.query

              server.methods.services.rdt.GetRdtSummaryByCities(
                  query,
                  (err, result) => {
                      if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                      return reply(
                          constructRdtResponse(result, request)
                      ).code(200)
                  })
        }


    }//end

}
