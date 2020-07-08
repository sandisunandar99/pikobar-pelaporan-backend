const { ERRORS, HTTP } = require('../../helpers/constant')
const replyHelper = require('../helpers')

const getCloseContactbyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.closeContactId
             server.methods.services.closeContacts
                .show(id, (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err).takeover()
                    if (!result) {
                        return replyHelper.messageResponse(reply,
                            ERRORS.INVALID.PARAMS_VALUE, HTTP.UNPROCESSABLE_ENTITY
                        ).takeover()
                    }
                    return reply(result)
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
                .show(id, (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err).takeover()
                    if (!result) {
                        return replyHelper.messageResponse(reply,
                            ERRORS.INVALID.PARAMS_VALUE, HTTP.UNPROCESSABLE_ENTITY
                        ).takeover()
                    }
                    return reply(result)
                })
        },
        assign: 'close_contact_report'
    }
}

module.exports = {
    getCloseContactbyId,
    getReportbyCloseContactId
}
