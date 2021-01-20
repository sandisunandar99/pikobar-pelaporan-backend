const { isDirty } = require('../../helpers/custom')
const { replyJson, constructErrorResponse } = require('../helpers')
const { funcIfSame, requestIfSame } = require('../../helpers/request')

module.exports = (server) => {
  return {
    /**
     * GET /api/close-contacts
     * @param {*} request
     * @param {*} reply
     */
    async ListCloseContact(request, reply) {
      return await requestIfSame(server, 'closeContacts', 'index',
        request, reply
      )
    },
    /**
     * GET /api/cases/{caseId}/close-contacts
     * @param {*} request
     * @param {*} reply
     */
    async ListCloseContactCase(request, reply) {
      return await funcIfSame(server, 'closeContacts', 'getByCase',
        request, 'caseId', reply
      )
    },
    /**
     * POST /api/cases/{caseId}/close-contacts
     * @param {*} request
     * @param {*} reply
     */
    async CreateCloseContact(request, reply) {
      server.methods.services.closeContacts.create(
        request.params.caseId,
        request.auth.credentials.user,
        request.payload,
        (err, result) => {
          if (err) return reply(constructErrorResponse(err)).code(422)

          server.methods.services.closeContactHistories.create(
            result._id,
            request.payload.latest_history,
            (err, resultChild) => {
              if (err) return reply(constructErrorResponse(err)).code(422)

              const res = Object.assign(result, { latest_history: resultChild })
              return reply(
                constructCloseContactResponse(res, request)
              ).code(200)
            })
        })
    },
    /**
     * GET /api/close-contacts/{closeContactId}
     * @param {*} request
     * @param {*} reply
     */
    async DetailCloseContact(request, reply) {
      return await funcIfSame(server, 'closeContacts', 'show',
        request, 'closeContactId', reply
      )
    },
    /**
     * PUT /api/close-contacts/{closeContactId}
     * @param {*} request
     * @param {*} reply
     */
    async UpdateCloseContact(request, reply) {
      const currentHistory = request.pre.close_contact.latest_history
      const requestHistory = request.payload.latest_history
      const isDirtys = isDirty(currentHistory, requestHistory)
      server.methods.services.closeContacts.update(
        request.params.closeContactId,
        request.auth.credentials.user,
        request.payload,
        (err, result) => {
          if (err) return reply(constructErrorResponse(err)).code(422)
          if (!requestHistory || !isDirtys) {
            const res = Object.assign(result, { latest_history: currentHistory })
            return reply(
              constructCloseContactResponse(res, request)
            ).code(200)
          } else {
            server.methods.services.closeContactHistories.create(
              result._id,
              requestHistory,
              (err, resultChild) => {
                const res = Object.assign(result, { latest_history: resultChild })
                replyJson(err, res, reply)
              })
          }
        })
    },
    /**
     * DELETE /api/close-contacts/{id}
     * @param {*} request
     * @param {*} reply
     */
    async DeleteCloseContact(request, reply) {
      const { closeContactId } = request.params
      const { user } = request.auth.credentials
      server.methods.services.closeContacts.delete(
        closeContactId, user,
        (err, result) => {
          replyJson(err, result, reply)
        })
    }
  }
}
