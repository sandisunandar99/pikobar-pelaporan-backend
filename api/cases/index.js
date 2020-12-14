const Routes = require('./routes')
const OtherRoutes = require('./routes_explode')

const register = (server, options, next) => {
  routing(server)
  return next()
}

const routing = (server) => {
  server.route(Routes(server))
  server.route(OtherRoutes(server))
}

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register