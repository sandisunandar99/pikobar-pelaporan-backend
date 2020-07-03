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
                request.pre,
                (err, result) => {
                    if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                    return reply(
                        constructCasesResponse(result,request)
                    ).code(200)
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
