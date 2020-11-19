module.exports = (server) =>{
  const handlers = require('./handlers')
  const roleView = require('../users/route_prerequesites').CheckRoleView(server)
  const route = (method, path, callback) => {
    return {
      method: method,
      path: path,
      config: {
        description: ` ${method} dashboard`,
        tags: [ 'api', 'list', 'dashboard input test', ],
        pre: [ roleView ],
        auth: 'jwt',
      },
      handler: handlers[callback](server),
    }
  }

  return [
    route('GET', '/dashboard/summary-input-test', 'summaryInputTest'),
  ]
}
