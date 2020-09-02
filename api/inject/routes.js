module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)

  return [
    {
      method: 'GET',
      path: '/inject/last-history',
      config: {
        auth: 'jwt',
        description: 'inject last history',
        tags: ['api', 'health for inject'],
        pre: [ CheckRoleView ]
      },
      handler: handlers.injectLastHistory
    }
  ]
}