const inputValidations = require('./validations/input')
module.exports = (server) =>{
  const handlers = require('./handlers')
  const sheetToJson = require('./route_prerequesites').sheetToJson(server)
  const isImportBusy = require('./route_prerequesites').isImportBusy(server)
  const getCasebyId = require('../../cases/route_prerequesites').getCasebyId(server)
  const CheckRoleCreate = require('../../users/route_prerequesites').CheckRoleCreate(server)
  const checkCaseIsExists = require('../../cases/route_prerequesites').checkCaseIsExists(server)
  const countCaseByDistrict = require('../../cases/route_prerequesites').countCaseByDistrict(server)
  const countCasesOutsideWestJava = require('./route_prerequesites').countCasesOutsideWestJava(server)
  const countCasePendingByDistrict = require('../../cases/route_prerequesites').countCasePendingByDistrict(server)

  return [
    {
      method: 'POST',
      path: '/v2/cases',
      config: {
        auth: 'jwt',
        description: 'create new cases',
        tags: [ 'api', 'v2.cases' ],
        validate: inputValidations.RequestPayload,
        pre: [
          CheckRoleCreate,
          checkCaseIsExists,
          countCaseByDistrict,
          countCasesOutsideWestJava,
          countCasePendingByDistrict,
        ]
      },
      handler: handlers.CreateCase(server)
    },
    {
      method: 'GET',
      path: '/v2/cases/{id}/status',
      config: {
        auth: 'jwt',
        description: 'get specific case status',
        tags: ['api', 'cases'],
        pre: [ getCasebyId ]
      },
      handler: handlers.GetCaseSectionStatus(server)
    },
    {
      method: 'GET',
      path: '/v2/cases/{id}/export-to-pe-form',
      config: {
        auth: 'jwt',
        pre: [ getCasebyId ],
        description: 'Export Case to epidemiological investigation Form',
        tags: ['api', 'epidemiological.investigation.form'],
      },
      handler: handlers.ExportEpidemiologicalForm(server)
    },
    {
      method: 'POST',
      path: '/v2/cases-import',
      config: {
        auth: 'jwt',
        description: 'Cases import',
        tags: ['api', 'cases'],
        payload: {
          maxBytes: 1000 * 1000 * 25,
          output: 'stream',
          parse: true,
          allow: 'multipart/form-data'
        },
        pre: [ sheetToJson, isImportBusy ],
      },
      handler: handlers.ImportCases(server)
    },
  ]
}
