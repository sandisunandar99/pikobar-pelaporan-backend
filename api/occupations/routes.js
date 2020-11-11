module.exports = (server, route) => {
  const handlers = require('./handlers')(server)

  return [
    route(handlers, 'GET', '/occupations', 'occupations', 'ListOccupation'),
    route(handlers, 'GET', '/occupations/{id}', 'occupations', 'GetOccupationDetail'),
  ]
}