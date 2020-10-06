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
      config: {
        auth: 'jwt',
        description: 'create case-exposure',
        tags: ['api', 'case-exposure'],
        pre: [ CheckRoleCreate ]
      },
      handler: handlers.createCaseExposure(server)
    },
    {
      method: 'GET',
      path: '/case-exposure/{id_case}',
      config: {
        auth: 'jwt',
        description: 'show list case-exposure',
        tags: ['api', 'case-exposure'],
        pre: [ CheckRoleView ]
      },
      handler:  handlers.getCaseExposure(server)
    },
    {
      method: 'PUT',
      path: '/case-exposure/{id_case_exposure}',
      config: {
        auth: 'jwt',
        description: 'update case-exposure',
        tags: ['api', 'case-exposure'],
        pre: [ CheckRoleUpdate ],
      },
      handler:  handlers.updateCaseExposure(server)
    },
    {
      method: 'DELETE',
      path: '/case-exposure/{id_case_exposure}',
      config: {
        auth: 'jwt',
        description: 'delete case-exposure',
        tags: ['api', 'case-exposure'],
        pre: [ CheckRoleDelete ],
      },
      handler: handlers.deleteCaseExposure(server)
    }
  ]
}