const moment = require('moment')
const replyHelper = require('../../helpers')
const { replyJson } = require('../../helpers')
const pdfmaker = require('../../../helpers/pdfmaker')

/**
 * POST /api/v2/cases
 */
const CreateCase = (server) => {
  return (request, reply) => {
    server.methods.services.v2.cases.create(
      request.pre,
      request.payload,
      request.auth.credentials.user,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

/**
 * GET /api/v2/cases/{id}/status
 */
const GetCaseSectionStatus = (server) => {
  return (request, reply) => {
    server.methods.services.v2.cases.getCaseSectionStatus(
      request.params.id,
      (err, result) => {
        replyJson(err, result, reply)
      }
    )
  }
}

/**
 * GEt /api/v2/cases/{id}/export-to-pe-form
 */
const ExportEpidemiologicalForm = (server) => {
  return (request, reply) => {
    const thisCase = request.pre.cases
    const caseName = thisCase.name.replace(/[\W_]+/g, '-')
    server.methods.services.v2.cases.exportEpidemiologicalForm(
      server.methods.services,
      thisCase,
      async (err, result) => {
        if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
        const fileName = `FORMULIR-PE-${caseName}-${moment().format("YYYY-MM-DD-HH-mm")}.pdf`
        const pdfFile = await pdfmaker.generate(result, fileName)
        return reply(pdfFile).header('Content-Disposition', 'attachment; filename='+fileName)
      }
    )
  }
}

module.exports = {
  CreateCase,
  GetCaseSectionStatus,
  ExportEpidemiologicalForm,
}
