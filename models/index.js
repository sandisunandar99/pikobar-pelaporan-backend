const mongoose = require('mongoose');
const config = require('../config/config');
const bluebird = require('bluebird');

const register = (server, options, next) => {
  mongoose.Promise = bluebird;
  mongoose.connect(config.database.uri, config.database.options, (err, db) => {
    if (err) console.log(err);

    require('./User')
    // require('./Province')
    require('./DistrictCity')
    require('./SubDistrict')
    require('./Village')
    require('./Case')
    require('./History')

    server.app.db = {
      link: db.db,
      User: db.model('User'),
      // Province: db.model('Province'),
      DistrictCity: db.model('Districtcity'),
      SubDistrict: db.model('SubDistrict'),
      Village: db.model('Village'),
      Case: db.model('Case'),
      History: db.model('History')
    };

    return next();
  });
};

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register;
