module.exports = (server) => {
  const handlers = require('./handlers')


 const route = (method, path, validates, pre, callback) => {
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
    route('GET', '/occupations', null, [], 'ListOccupation'),
    route('GET', '/occupations/{id}', null, [], 'GetOccupationDetail'),
  ]
}