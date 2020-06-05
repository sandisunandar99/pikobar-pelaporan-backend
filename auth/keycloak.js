const config = require('../config/config');

const register = (server, options, next) => {
  var validateFunc = (decoded, request, callback) => {
    var username = decoded.preferred_username

    server.app.db.User.findOne({username: username}, (err, user) => {
      if (err) return callback(err, false);

      if (!user) {
        return callback(null, false);
      }

      return callback(null, true, {
        user
      });
    });
  };

  server.auth.strategy('jwt', 'jwt', {
    key: config.authKeycloak.secret,
    validateFunc: validateFunc,
    tokenType: config.authKeycloak.tokenType,
    verifyOptions: config.authKeycloak.verifyOptions
  });

  return next();
};

register.attributes = {
  pkg: require('./package.json')
}


module.exports = register;
