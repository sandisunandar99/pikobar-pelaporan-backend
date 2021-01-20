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
      server.methods.services.closeContacts.delete(
        request.params.closeContactId,
        request.auth.credentials.user,
        (err, result) => {
          replyJson(err, result, reply)
        })
    },
    /**
     *
     *
     * @param {*} request
     * @param {*} reply
     */
    async ListCloseContactCaseV2(request, reply) {
      server.methods.services.closeContacts.v2.getByCase(
        request.pre.cases,
        (err, result) => {
          replyJson(err, result, reply)
        })
    },
    /**
     * POST /api/cases/{caseId}/close-contacts-v2
     * @param {*} request
     * @param {*} reply
     */
    async CreateCloseContactV2(request, reply) {
      server.methods.services.closeContacts.v2.create(
        server.methods.services,
        request.pre,
        request.auth.credentials.user,
        request.payload,
        (err, result) => {
          replyJson(err, result, reply)
        })
    },
    /**
     * PUT /api/cases/{caseId}/close-contacts-v2
     * @param {*} request
     * @param {*} reply
     */
    async updateCloseContactV2(request, reply) {
      const pre = request.pre
      const id = request.params.caseId
      const payload = request.payload
      const author = request.auth.credentials.user

      server.methods.services.cases.update(id, pre, author, payload, (errCase, resultCase) => {
        if (errCase) return reply(constructErrorResponse(errCase)).code(422)

        server.methods.services.histories.createIfChanged(
          Object.assign(payload, { case: id }),
          (err, result) => {
            replyJson(err, result, reply)
          })
      })
    },
    /**
     * DELETE api/cases/{caseId}/close-contacts-v2/{contactCaseId}
     * @param {*} request
     * @param {*} reply
     */
    async DeleteCloseContactV2(request, reply) {
      server.methods.services.closeContacts.v2.pullCaseContact(
        request.pre.cases,
        request.pre.contactCase,
        (err, result) => {
          if (err) return reply(constructErrorResponse(err)).code(422)
          return reply(
            constructCloseContactResponse(result, request)
          ).code(200)
        })
    },
  }
}
