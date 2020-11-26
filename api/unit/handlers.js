const { replyHelper, successResponse } = require('../helpers');

module.exports = (server) => {

  return {
    /**
     * GET /api/unit
     * @param {*} request
     * @param {*} reply
     */
    async getUnit(request, reply) {
      server.methods.services.unit.read(request.query, (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(
          successResponse(result, request)
        ).code(200)
      }
      )
    },
    async listUnitById(request, reply) {
      server.methods.services.unit.readbyid(request.params.id,
        (err, result) => {
          if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
          return reply(
            successResponse(result, request)
          ).code(200)
        }
      )
    },
  };
}