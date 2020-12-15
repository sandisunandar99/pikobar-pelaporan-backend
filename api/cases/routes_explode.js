module.exports = (server) => {
  const handlers = require('./handler_explode')
  const checkRoleUpdate = require('../users/route_prerequesites').CheckRoleUpdate(server)

  return [
    {
      method: 'PUT',
      path: '/v2/cases/multiple-update',
      config: {
        auth: 'jwt',
        description: 'update cases multiplt by id case',
        tags: ['api', 'cases'],
        pre: [ checkRoleUpdate ]
      },
      handler: handlers.multipleUpdateCase(server)
    },
  ]
}
