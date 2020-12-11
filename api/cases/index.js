const Routes = require('./routes')
const OtherRoutes = require('./routes_explode')

const register = (server, options, next) =>{
    server.route(Routes(server))
    server.route(OtherRoutes(server))
    return next()
}

register.attributes ={
    pkg: require('./package.json')
}

module.exports = register