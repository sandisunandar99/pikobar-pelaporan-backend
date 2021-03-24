module.exports = (server, route) => {
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)

  return [
    route(
      server, 'GET', '/queue/cases',
      'queue', CheckRoleView, 'caseExport'
    ),route(
      server, 'GET', '/queue/histories',
      'queue', CheckRoleView, 'historyExport'
    ),route(
      server, 'GET', '/queue',
      'queue', CheckRoleView, 'listExport'
    ),route(
      server, 'POST', '/queue',
      'queue', CheckRoleCreate, 'resendFile'
    ),route(
      server, 'PUT', '/queue/{jobid}',
      'queue', CheckRoleCreate, 'cancelJob'
    )
  ]
}