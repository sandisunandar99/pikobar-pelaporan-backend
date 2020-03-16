const mongoose = require('mongoose');
const config = require('../config/config');
const bluebird = require('bluebird');

const register = (server, options, next) => {
  mongoose.Promise = bluebird;
  mongoose.connect(config.database.uri, config.database.options, (err, db) => {
    if (err) console.log(err);

    require('./User')
    require('./Survey')
    require('./Question')
    require('./Answer')
    require('./Province')
    require('./DistrictCity')
    require('./SubDistrict')
    require('./Village')


    server.app.db = {
      link: db.db,
      User: db.model('User'),
      Survey: db.model('Survey'),
      Question: db.model('Question'),
      Answer: db.model('Answer'),
      Province: db.model('Province'),
      DistrictCity: db.model('Districtcity'),
      SubDistrict: db.model('SubDistrict'),
      Village: db.model('Village')
    };

    return next();
  });
};

register.attributes = {
  pkg: require('./package.json')
}

module.exports = register;
