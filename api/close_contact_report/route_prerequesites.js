const replyHelper = require('../helpers')

const getCloseContactbyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.closeContactId
             server.methods.services.closeContacts
                .show(id, (err, item) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err))
                            .code(422).takeover()
                    }
                    return reply(item)
                })
        },
        assign: 'close_contact'
    }
}

const getReportbyCloseContactId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.closeContactId
             server.methods.services.closeContactReport
                .show(id, (err, item) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err))
                            .code(422).takeover()
                    }
                    return reply(item)
                })
        },
        assign: 'close_contact_report'
    }
}

module.exports = {
    getCloseContactbyId,
    getReportbyCloseContactId
}
