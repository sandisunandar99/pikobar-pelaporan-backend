const replyHelper = require('../helpers')
const { validateLocation } = require('../../helpers/request')

const getCasebyId = server => {
    return {
        method: (request, reply) => {
             const { caseId } = request.params
             server.methods.services.cases
                .getById(caseId, (err, result) => {
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

const districtInputScope = server => {
    const message = 'Anda tidak dapat melakukan input Kontak Erat di luar wilayah anda.!'
    return {
        method: (request, reply) => validateLocation(request, reply, message),
        assign: 'district_input_scope'
    }
}

module.exports = {
    getCasebyId,
    getCloseContactbyId,
    districtInputScope,
}
