const replyHelper = require('../helpers')

module.exports = (server) => {
    function constructRdtResponse(rdt) {
        let jsonRdt = {
            status: 200,
            message: "Success",
            data: rdt
        }
        return jsonRdt
    }

    return {
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

        async CreateRdt(request, reply){
            let query  = request.query
            server.methods.services.rdt.create(
                query,
                request.payload,
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

        async CreateRdtMultiple(request, reply){
            let payload =
            server.methods.services.rdt.createMultiple(
                request.payload,
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

        async GetRdtDetail(request, reply) {
            let id = request.params.id
            server.methods.services.rdt.getById(id, (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructRdtResponse(item)
                ).code(200)
            })
        },

        async GetRdtHistories(request, reply) {
            let id = request.params.id
            server.methods.services.rdt.getHistoriesByRdtId(id, (err, item) => {
                if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                return reply(
                    constructRdtResponse(item)
                ).code(200)
            })
        },

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

        async DeleteRdt(request, reply) {
            server.methods.services.rdt.softDeleteRdt(
                request.pre.rdt,
                // request.pre.cases,
                request.auth.credentials.user,
                (err, item) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                     return reply(
                         constructRdtResponse(item)
                     ).code(202)
                })
        },

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

        async GetListIdCaseDetail(request, reply) {
            server.methods.services.rdt.FormSelectIdCaseDetail(
                request.pre.search_internal,
                request.pre.search_external,
                // request.auth.credentials.user,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructRdtResponse(result, request)
                    ).code(200)
            })
        },

        async GetListRegisteredUser(request, reply) {
            server.methods.services.rdt.getRegisteredUser(
                request.pre.reg_user_external,
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructRdtResponse(result, request)
                    ).code(200)
            })
        },

        async formLocationTest(request, reply) {
            server.methods.services.rdt.getLocationTest(
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructRdtResponse(result, request)
                    ).code(200)
            })
        },

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
        },

        async GetRdtSummaryResultByCities(request, reply) {
              let query = request.query

              server.methods.services.rdt.GetRdtSummaryResultByCities(
                  query,
                  (err, result) => {
                      if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                      return reply(
                          constructRdtResponse(result, request)
                      ).code(200)
                  })
        },

        async GetRdtSummaryResultListByCities(request, reply) {
              let query = request.query

              server.methods.services.rdt.GetRdtSummaryResultListByCities(
                  query,
                  (err, result) => {
                      if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                      return reply(
                          constructRdtResponse(result, request)
                      ).code(200)
                  })
        },

        async GetRdtFaskesSummaryByCities(request, reply) {
              let query = request.query

              server.methods.services.rdt.GetRdtFaskesSummaryByCities(
                  query,
                  (err, result) => {
                      if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                      return reply(
                          constructRdtResponse(result, request)
                      ).code(200)
                  })
        },

        async sendMessage(result) {
            let query = request.query
            server.methods.services.rdt.sendMessagesSMS(
                query,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructRdtResponse(result, request)
                    ).code(200)
                })
            server.methods.services.rdt.sendMessagesWA(
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
