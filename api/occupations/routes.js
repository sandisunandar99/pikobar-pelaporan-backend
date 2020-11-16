module.exports = (server) => {
  const handlers = require('./handlers')


 const route_occ = (method, path, validates, pre, callback) => {
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
    route_occ('GET', '/occupations', null, [], 'ListOccupation'),
    route_occ('GET', '/occupations/{id}', null, [], 'GetOccupationDetail'),
  ]
}