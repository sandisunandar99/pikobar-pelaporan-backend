module.exports = (server, route) => {
  const service = 'inspection_support'
  const path = '/inspection-support/'
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRole = require('../users/route_prerequesites').CheckRoleDelete(server)

  return [
    route(server, 'POST', `${path}{id_case}`, service, CheckRole, 'createInspectionSupport'),
    route(server, 'GET', `${path}{id_case}`, service, CheckRoleView, 'getInspectionSupport'),
    route(server, 'PUT', `${path}{id_inspection_support}`, service, CheckRole, 'updateInspectionSupport'),
    route(server, 'DELETE', `${path}{id_inspection_support}`, service, CheckRole, 'deleteInspectionSupport')
  ]
}