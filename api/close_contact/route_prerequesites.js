const replyHelper = require('../helpers')

const getCasebyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.caseId
             server.methods.services.cases
                .getById(id, (err, result) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                    }
                    if (!result) {
                        return reply({
                            status: 422,
                            message: 'Invalid case id',
                            data: null
                        }).code(422).takeover()
                    }
                    return reply(result)
                })
        },
        assign: 'cases'
    }
}

const getCloseContactbyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.closeContactId
             server.methods.services.closeContacts
                .show(id, (err, result) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).code(422).takeover()
                    }
                    if (!result) {
                        return reply({
                            status: 422,
                            message: 'Invalid close contact id',
                            data: null
                        }).code(422).takeover()
                    }
                    return reply(result)
                })
        },
        assign: 'close_contact'
    }
}

module.exports = {
    getCasebyId,
    getCloseContactbyId
}
