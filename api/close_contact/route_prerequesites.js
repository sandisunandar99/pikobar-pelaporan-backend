const replyHelper = require('../helpers')

const getCasebyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.caseId
             server.methods.services.cases
                .getById(id, (err, item) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err))
                            .code(422).takeover()
                    }
                    return reply(item)
                })
        },
        assign: 'cases'
    }
}

module.exports = {
    getCasebyId
}
