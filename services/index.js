const register = (server, options, next) => {
  let services = [].concat(
      require('./users'),
      require('./areas'),
      require('./cases'),
      require('./cases_transfers'),
      require('./cases_verifications'),
      require('./histories'),
      require('./occupations'),
      require('./rdt'),
      require('./category'),
      require('./rdt_histories'),
      require('./country'),
      require('./dashboard'),
      require('./notifications'),
      require('./map'),
      require('./unit'),
      require('./case_related'),
      require('./close_contact'),
      require('./close_contact_report'),
      require('./close_contact_report_histories'),
    );
    server.method(services)
    return next()
  }

  register.attributes = {
    pkg: require('./package.json')
  }

  module.exports = register
