module.exports = (server) => {
  const handlers = require('./handlers')
  const {configRouteComplete} = require('../../helpers/routes')

  return [
    configRouteComplete('GET', '/occupations', null, [], 'Occupation', handlers.ListOccupation(server)),
    configRouteComplete('GET', '/occupations/{id}', null, [], 'Occupation', handlers.GetOccupationDetail(server)),
  ]
}