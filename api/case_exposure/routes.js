const { configRoute} = require("../../helpers/routes")
module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)
  const CheckRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)
  const CheckRoleDelete = require('../users/route_prerequesites').CheckRoleDelete(server)

  return [
    {
      method: 'POST',
      path: '/case-exposure/{id_case}',
      config: configRoute("create case-exposure", "case-exposure", CheckRoleCreate),
      handler: handlers.createCaseExposure(server)
    },
    {
      method: 'GET',
      path: '/case-exposure/{id_case}',
      config: configRoute("show list case-exposure", "case-exposure", CheckRoleView),
      handler:  handlers.getCaseExposure(server)
    },
    {
      method: 'PUT',
      path: '/case-exposure/{id_case_exposure}',
      config: configRoute("update case-exposure", "case-exposure", CheckRoleUpdate),
      handler:  handlers.updateCaseExposure(server)
    },
    {
      method: 'DELETE',
      path: '/case-exposure/{id_case_exposure}',
      config: configRoute("delete case-exposure", "case-exposure", CheckRoleDelete),
      handler: handlers.deleteCaseExposure(server)
    }
  ]
}