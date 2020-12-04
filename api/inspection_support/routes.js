module.exports = (server, route) => {
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRole = require('../users/route_prerequesites').CheckRoleDelete(server)
  const service = 'inspection_support'
  const pathCase = '/inspection-support/{id_case}'
  const pathInspec = '/inspection-support/{id_inspection_support}'

  return [
    route(server, 'POST', pathCase, service, CheckRole, 'createInspectionSupport'),
    route(server, 'GET', pathCase, service, CheckRoleView, 'getInspectionSupport'),
    route(server, 'PUT', pathInspec, service, CheckRole, 'updateInspectionSupport'),
    route(server, 'DELETE', pathInspec, service, CheckRole, 'deleteInspectionSupport')
  ]
}