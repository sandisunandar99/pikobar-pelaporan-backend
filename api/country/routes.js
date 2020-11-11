module.exports = (server) => {
  const handlers = require('./handlers')(server)
  const route = (method, path, callback) => {
    const config = {
      description: ` ${method} country`,
      tags: ['api', 'list', 'country',],
      auth: 'jwt',
    }
    return {
      method: method,
      path: path,
      config: config,
      handler: handlers[callback],
    }
  }

  return [
    route('GET', '/country', 'listCountry'),
    route('GET', '/menu', 'listMenu'),
  ]
}