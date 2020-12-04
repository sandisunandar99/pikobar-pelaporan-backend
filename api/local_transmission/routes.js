module.exports = (server, route) => {
  const service = 'local_transmission'
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRole = require('../users/route_prerequesites').CheckRoleDelete(server)

  return [
    route(server, 'POST', `/${service}/{id_case}`, service, CheckRole, 'createLocalTransmission'),
    route(server, 'GET', `/${service}/{id_case}`, service, CheckRoleView, 'getLocalTransmission'),
    route(server, 'PUT', `/${service}/{id_local_transmission}`, service, CheckRole, 'updateLocalTransmission'),
    route(server, 'DELETE', `/${service}/{id_local_transmission}`, service, CheckRole, 'deleteLocalTransmission')
  ]
}