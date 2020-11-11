module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const route = (method, path, callback) => {
    return {
      method: method,
      path: path,
      config: {
        description: ` ${method} country`,
        tags: ['api', 'list', 'country',],
        auth: 'jwt',
      },
      handler: handlers[callback],
    }
  }

  return [
    route('GET', '/country', 'listCountry'),
    route('GET', '/menu', 'listMenu'),
  ]
}