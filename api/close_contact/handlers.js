const { HTTP } = require('../../helpers/constant')
const replyHelper = require('../helpers')
const Helper = require('../../helpers/custom')

module.exports = (server) => {
    return {
        /**
         * GET /api/close-contacts
         * @param {*} request
         * @param {*} reply
         */
        async ListCloseContact(request, reply){
            server.methods.services.closeContacts.index(
                request.query,
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)
                    return replyHelper.successResponse(reply, result, HTTP.OK)
                })
        },
        /**
         * GET /api/cases/{caseId}/close-contacts
         * @param {*} request
         * @param {*} reply
         */
        async ListCloseContactCase(request, reply){
            server.methods.services.closeContacts.getByCase(
                request.params.caseId, 
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)
                    return replyHelper.successResponse(reply, result, HTTP.OK)
                })
        },
        /**
         * POST /api/cases/{caseId}/close-contacts
         * @param {*} request
         * @param {*} reply
         */
        async CreateCloseContact(request, reply){
            server.methods.services.closeContacts.create(
                request.params.caseId,
                request.auth.credentials.user,
                request.payload,
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)

                    server.methods.services.closeContactHistories.create(
                        result._id,
                        request.payload.latest_history,
                        (err, resultChild) => {
                            if (err) return replyHelper.errorResponse(reply, err)
                            
                            const res = Object.assign(result, { latest_history: resultChild })
                            return replyHelper.successResponse(reply, res, HTTP.CREATED)
                        })
                })
        },
        /**
         * GET /api/cases/{caseId}/close-contacts/{closeContactId}
         * @param {*} request
         * @param {*} reply
         */
        async DetailCloseContact(request, reply) {
            server.methods.services.closeContacts.show(
                request.params.closeContactId,
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)
                    return replyHelper.successResponse(reply, result, HTTP.OK)
                })
        },
        /**
         * PUT /api/cases/{caseId}/close-contacts/{closeContactId}
         * @param {*} request
         * @param {*} reply
         */
        async UpdateCloseContact(request, reply){
            const currentHistory = request.pre.close_contact.latest_history
            const requestHistory = request.payload.latest_history
            const isDirty = Helper.isDirty(currentHistory, requestHistory)
            server.methods.services.closeContacts.update(
                request.params.closeContactId,
                request.auth.credentials.user,
                request.payload,
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)

                    if (!requestHistory || !isDirty) {
                        const res = Object.assign(result, { latest_history: currentHistory })
                        return replyHelper.successResponse(reply, res, HTTP.OK)
                    } else {
                        server.methods.services.closeContactHistories.create(
                            result._id,
                            requestHistory,
                            (err, resultChild) => {
                                if (err) return replyHelper.errorResponse(reply, err)
                                
                                const res = Object.assign(result, { latest_history: resultChild })
                                return replyHelper.successResponse(reply, res, HTTP.OK)
                            })
                    }
                })
        },
        /**
         * DELETE /api/cases/{caseId}/close-contacts/{id}
         * @param {*} request
         * @param {*} reply
         */
        async DeleteCloseContact(request, reply) {          
            server.methods.services.closeContacts.delete(
                request.params.closeContactId,
                request.auth.credentials.user,
                (err, result) => {
                    if (err) return replyHelper.errorResponse(reply, err)
                    return replyHelper.successResponse(reply, result, HTTP.OK)
                })
        }
    }
}
