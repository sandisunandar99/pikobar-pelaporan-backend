module.exports = (server) => {
  const handlers = require('./handlers')
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const CheckRoleCreate = require('../users/route_prerequesites').CheckRoleCreate(server)

   const route = (method, path, validates, pre, callback) => {
    return {
      method: method,
      path: path,
      config: {
        auth: 'jwt',
        description: `${method} inject data`,
        tags: [ 'api', 'rdt', ],
        pre: pre,
        validate: validates
      },
      handler: handlers[callback](server),
    }
  }

  return [
    route('GET', '/inject/last-history', null, [ CheckRoleView ], 'injectLastHistory'),
    route('POST', '/inject/rdt', null, [ CheckRoleCreate ], 'injectRdtTest')
  ]
}