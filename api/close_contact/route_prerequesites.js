const { ERRORS, HTTP } = require('../../helpers/constant')
const replyHelper = require('../helpers')

const getCasebyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.caseId
             server.methods.services.cases
                .getById(id, (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err).takeover()
                    if (!result) {
                        return replyHelper.messageResponse(reply,
                            ERRORS.INVALID.PARAMS_VALUE, HTTP.UNPROCESSABLE_ENTITY
                        ).takeover()
                    }
                    return reply(result)
                })
        },
        assign: 'cases'
    }
}

module.exports = {
    getCasebyId
}
