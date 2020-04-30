const register = (server, options, next) => {
  let services = [].concat(
      require('./users'),
      require('./areas'),
      require('./cases'),
      require('./cases_verifications'),
      require('./histories'),
      require('./occupations'),
      require('./rdt'),
      require('./category'),
      require('./rdt_histories'),
      require('./country'),
      require('./dashboard'),
    );
    server.method(services)
    return next()
  }

  register.attributes = {
    pkg: require('./package.json')
  }

  module.exports = register
