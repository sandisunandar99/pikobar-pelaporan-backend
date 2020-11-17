<<<<<<< HEAD
module.exports = (server, route) => {
  return [
    route(server, 'GET', '/occupations', 'occupations', 'ListOccupation'),
    route(server, 'GET', '/occupations/{id}', 'occupations', 'GetOccupationDetail'),
=======
module.exports = (server) => {
  const handlers = require('./handlers')
  const {configRouteComplete} = require('../../helpers/routes')

  return [
    configRouteComplete('GET', '/occupations', null, [], 'Occupation', handlers.ListOccupation(server)),
    configRouteComplete('GET', '/occupations/{id}', null, [], 'Occupation', handlers.GetOccupationDetail(server)),
>>>>>>> eb3ac9660fde88d4374f35e76af52c1c6ccfa2b9
  ]
}