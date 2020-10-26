module.exports = (server) =>{
  const handlers = require('./handlers')
  const getCasebyId = require('../../cases/route_prerequesites').getCasebyId(server)
  const CheckRoleCreate = require('../../users/route_prerequesites').CheckRoleCreate(server)
  const checkCaseIsExists = require('../../cases/route_prerequesites').checkCaseIsExists(server)
  const countCaseByDistrict = require('../../cases/route_prerequesites').countCaseByDistrict(server)
  const countCasesOutsideWestJava = require('./route_prerequesites').countCasesOutsideWestJava(server)
  const countCasePendingByDistrict = require('../../cases/route_prerequesites').countCasePendingByDistrict(server)

  const route = (method, path, callback, pre)  => {
    return  {
      method: method,
      path: path,
      config: {
        auth: 'jwt',
        description: ` ${method} v2/cases`,
        tags: ['api', 'v2.cases'],
        pre: pre
      },
      handler: handlers[callback](server),
    }
  }

  return [
    route('POST', '/v2/cases', 'CreateCase', [
      CheckRoleCreate,
      checkCaseIsExists,
      countCaseByDistrict,
      countCasesOutsideWestJava,
      countCasePendingByDistrict,
    ]),
    route('GET', '/v2/cases/{id}/status', 'GetCaseSectionStatus', [
      getCasebyId
    ]),
    route('GET', '/v2/cases/{id}/export-to-pe-form', 'ExportEpidemiologicalForm', [
      getCasebyId
    ]),
    route('GET', '/v2/cases/{id}/summary', 'GetDetailCaseSummary', [
      getCasebyId
    ]),
  ]
}
