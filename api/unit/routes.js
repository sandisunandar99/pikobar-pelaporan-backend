module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const CheckRoleView = require('../users/route_prerequesites').CheckRoleView(server)
  const inputValidations = require('./validations/input')
  const { routeWithPreOld  } = require('../../helpers/routes')

  return [{
    method: 'GET',
    path: '/unit',
    config: {
      auth: 'jwt',
      description: 'show list unit',
      tags: ['api', 'unit'],
      validate: inputValidations.UnitQueryValidations,
      pre: [CheckRoleView]
    },
    handler: handlers.getUnit
  },
  routeWithPreOld(server, 'GET', '/unit/{id}', 'unit', CheckRoleView, 'listUnitById')
  ]
}