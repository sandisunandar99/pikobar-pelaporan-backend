module.exports = (server) => {
  const route = (method, path, callback) => {
    const handlers = require('./handlers')(server)
    return {
      method: method,
      path: path,
      config: {
        description: ` ${method} occupations`,
        tags: ['api', 'list', 'occupations',],
        auth: 'jwt',
      },
      handler: handlers[callback],
    }
  }

  return [
    route('GET', '/occupations', 'ListOccupation'),
    route('GET', '/occupations/{id}', 'GetOccupationDetail'),
  ]
}