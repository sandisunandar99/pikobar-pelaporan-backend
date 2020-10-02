module.exports = (server) => {
  const handlers = require('./handlers')(server);
  const inputValidations = require('./validations/input');
  return [
    {
      method: 'GET',
      path: '/dashboard/v2/summary-case-criteria',
      config: {
        auth: 'jwt',
        description: 'show dashboard case new revision',
        tags: ['api', 'dashboard case new revision'],
        validate: inputValidations.caseDashboard
      },
      handler: handlers.countSectionTop,
    },{
      method: 'GET',
      path: '/dashboard/v2/summary-case',
      config: {
        auth: 'jwt',
        description: 'show dashboard case new revision',
        tags: ['api', 'dashboard case new revision'],
        validate: inputValidations.caseDashboard
      },
      handler: handlers.countSummary,
    },{
      method: 'GET',
      path: '/dashboard/v2/visualization-case',
      config: {
        auth: 'jwt',
        description: 'show dashboard case new revision',
        tags: ['api', 'dashboard case new revision'],
        validate: inputValidations.caseDashboard
      },
      handler: handlers.countVisualization,
    }
  ]
}