const schedule = require('node-schedule')
const replyHelper = require('../helpers')
const { replyJson } = require('../helpers')

module.exports = (server) => {
  // running task every 1 hours
  schedule.scheduleJob('*/59 * * * *', function() {
    const { services } = server.methods
    services.casesVerifications.createCasesVerification(
      services, (err, result) => {
      if (err) return false
      return true
    })
  });

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
         * PUT /api/cases/{id}/verifications
         * @param {*} request
         * @param {*} reply
         */
        async ReviseCaseVerification(request, reply){
            const pre = request.pre
            const id = request.params.id
            const payload = request.payload
            const author = request.auth.credentials.user
            const verifPayload = {
                verified_status: 'pending',
                verified_comment: payload.verified_comment
            }

            server.methods.services.cases.update(id, pre, author, payload, (errCase, resultCase) => {
                if (errCase) return reply(replyHelper.constructErrorResponse(errCase)).code(422)

                server.methods.services.histories.createIfChanged(
                    Object.assign(payload, {case: id}),
                    (errHis, resultHis) => {
                    if (errHis) return reply(replyHelper.constructErrorResponse(errHis)).code(422)

                    server.methods.services.casesVerifications.create(
                        id, author, request.pre.count_case, verifPayload,
                        (err, result) => {
                        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                        return reply(
                            constructCasesResponse(result, request)
                        ).code(200)
                    })
                })
            })
        },
        /**
         * POST /api/verifications/submit
         */
        async SubmitVerifications(request, reply) {
          server.methods.services.casesVerifications.submitMultipleVerifications(
            server.methods.services,
            request.payload,
            request.auth.credentials.user,
            (err, result) => {
              replyJson(err, result, reply)
            }
          )
        },
    }
}
