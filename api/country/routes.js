module.exports = (server, route) => {
  const handlers = require('./handlers')(server)

  return [
    route(handlers, 'GET', '/country', 'country', 'listCountry'),
    route(handlers, 'GET', '/menu', 'menu', 'listMenu'),
  ]
}