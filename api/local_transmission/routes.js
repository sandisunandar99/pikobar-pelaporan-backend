module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRole = require('../users/route_prerequesites').CheckRoleUpdate(server)

  return [
    {
      method: 'POST',
      path: '/local-transmission/{id_case}',
      config: {
        auth: 'jwt',
        description: 'create local-transmission',
        tags: ['api', 'local-transmission'],
        pre: [ CheckRole ]
      },
      handler: handlers.createLocalTransmission(server)
    },
    {
      method: 'GET',
      path: '/local-transmission/{id_case}',
      config: {
        auth: 'jwt',
        description: 'show list local-transmission',
        tags: ['api', 'local-transmission'],
        pre: [ CheckRoleView ]
      },
      handler:  handlers.getLocalTransmission(server)
    },
    {
      method: 'PUT',
      path: '/local-transmission/{id_local_transmission}',
      config: {
        auth: 'jwt',
        description: 'update local-transmission',
        tags: ['api', 'local-transmission'],
        pre: [ CheckRole ],
      },
      handler:  handlers.updateLocalTransmission(server)
    },
    {
      method: 'DELETE',
      path: '/local-transmission/{id_local_transmission}',
      config: {
        auth: 'jwt',
        description: 'delete local-transmission',
        tags: ['api', 'local-transmission'],
        pre: [ CheckRole ],
      },
      handler: handlers.deleteLocalTransmission(server)
    }
  ]
}