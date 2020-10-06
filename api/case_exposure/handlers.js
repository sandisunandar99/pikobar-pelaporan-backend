const { replyJson } = require('../helpers')
const createCaseExposure = (server) => {
  return (request, reply) => {
    server.methods.services.case_exposure.create(
      request.payload,
      request.params.id_case,
      (err, result) => {
        replyJson(err, result, reply)
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
        replyJson(err, result, reply)
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
        replyJson(err, result, reply)
      }
    )
  }
}

const deleteCaseExposure = (server) => {
  return (request, reply) => {
    server.methods.services.case_exposure.delete(
      request.params.id_case_exposure,
      (err, result) => {
        replyJson(err, result, reply)
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