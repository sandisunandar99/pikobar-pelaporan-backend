const { constructErrorResponse, successResponse } = require('../helpers')
const createCaseExposure = (server) => {
  return (request, reply) => {
    server.methods.services.case_exposure.create(
      request.payload,
      request.params.id_case,
      (err, result) => {
        if (err) return reply(constructErrorResponse(err)).code(422)
        return reply(
          successResponse(result, request)
        ).code(200)
      }
    )
  }
}

const getCaseExposure = (server) => {
  return (request, reply) => {
    const { id_case } = request.params
    server.methods.services.case_exposure.read(
      id_case,
      (err, result) => {
        if (err) return reply(constructErrorResponse(err)).code(422)
        return reply(
          successResponse(result, request)
        ).code(200)
      }
    )
  }
}

const updateCaseExposure = (server) => {
  return (request, reply) => {
    const { id_case_exposure } = request.params
    server.methods.services.case_exposure.update(
      id_case_exposure,
      request.payload,
      (err, result) => {
        if (err) return reply(constructErrorResponse(err)).code(422)
        return reply(
          successResponse(result, request)
        ).code(200)
      }
    )
  }
}

const deleteCaseExposure = (server) => {
  return (request, reply) => {
    server.methods.services.case_exposure.delete(
      request.params.id_case_exposure,
      (err, result) => {
        if (err) return reply(constructErrorResponse(err)).code(422)
        return reply(
          successResponse(result, request)
        ).code(200)
      }
    )
  }
}
/**
 * /api/case-exposure
 * @param {*} request
 * @param {*} reply
 */
module.exports = {
  createCaseExposure,
  getCaseExposure,
  updateCaseExposure,
  deleteCaseExposure
}