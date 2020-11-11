const Routes = require('./routes')

const register = (server, options, next) => {
  const handlers = require('./handlers')(server)
  server.route(Routes(handlers))
  return next()
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register