const { configWithValidation } = require("../../helpers/routes")
const routingExport = (handlers, server, validations, role) => {
  return [{
    method: 'GET', path: '/dashboard/v2/export-demographic',
    config: configWithValidation("export demographic", "export demographic",
      validations.caseDashboard, role
    ),
    handler: handlers.exportDemographic(server),
  },{
    method: 'GET', path: '/dashboard/v2/export-criteria',
    config: configWithValidation("export criteria", "export criteria",
      validations.caseDashboard, role
    ),
    handler: handlers.exportCriteria(server),
  }]
}

module.exports = (server) => {
  const handlers = require('./handlers')
  const inputValidations = require('./validations/input')
  const roleView = require('../users/route_prerequesites').CheckRoleView(server)
  return routingExport(handlers, server, inputValidations, roleView)
}