const replyHelper = require('../../helpers')
const { replyJson } = require('../../helpers')
const callback = (reply) => {
  return (err, result) => {
    replyJson(err, result, reply)
  }
}

/**
 * POST /api/v2/cases
 */
const CreateCase = (server) => {
  return (request, reply) => {
    server.methods.services.v2.cases.create(
      request.pre,
      request.payload,
      request.auth.credentials.user,
      callback(reply)
    )
  }
}

/**
 * GET /api/v2/cases/{id}/status
 */
const GetCaseSectionStatus = (server) => {
  return (request, reply) => {
    server.methods.services.v2.cases.getCaseSectionStatus(
      request.params.id, callback(reply)
    )
  }
}

/**
 * GET /api/v2/cases/{id}/export-to-pe-form
 */
const ExportEpidemiologicalForm = (server) => {
  return (request, reply) => {
    server.methods.services.v2.cases.exportEpidemiologicalForm(
      server.methods.services,
      request.pre.cases,
      async (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        return reply(result).header('Content-Disposition', 'attachment; filename='+fileName)
      }
    )
  }
}

/**
 * POST /api/v2/cases-import
 */
const ImportCases = (server) => {
  return (request, reply) => {
    server.methods.services.v2.cases.createMultiple(
      server.methods.services,
      request.pre.sheet_to_json,
      request.auth.credentials.user,
      callback(reply),
    )
  }
}

module.exports = {
  CreateCase,
  GetCaseSectionStatus,
  ExportEpidemiologicalForm,
  ImportCases,
}
