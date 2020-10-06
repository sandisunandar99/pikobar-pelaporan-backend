const routingDashboard = (handlers, server, inputValidations) => {
  return  [{
    method: 'GET',
    path: '/dashboard/v2/summary-case-criteria',
    config: {
      auth: 'jwt',
      description: 'show dashboard case new revision',
      tags: ['api', 'dashboard case new revision'],
      validate: inputValidations.caseDashboard
    },
    handler: handlers.countSectionTop(server),
  },{
    method: 'GET',
    path: '/dashboard/v2/summary-case',
    config: {
      auth: 'jwt',
      description: 'show dashboard case new revision',
      tags: ['api', 'dashboard case new revision'],
      validate: inputValidations.caseDashboard
    },
    handler: handlers.countSummary(server),
  },{
    method: 'GET',
    path: '/dashboard/v2/visualization-case',
    config: {
      auth: 'jwt',
      description: 'show dashboard case new revision',
      tags: ['api', 'dashboard case new revision'],
      validate: inputValidations.caseDashboard
    },
    handler: handlers.countVisualization(server),
  }]
}

module.exports = (server) => {
  const handlers = require('./handlers')
  const inputValidations = require('./validations/input')
  return routingDashboard(handlers, server, inputValidations)
}