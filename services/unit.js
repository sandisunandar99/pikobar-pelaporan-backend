const mongoose = require('mongoose');

require('../models/Unit');
const Unit = mongoose.model('Unit');

function listUnit(callback) {
    try {
        const result = Unit.find();
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}

function createUnit(request, callback){
  const unit = new Unit(request.payload);
  unit.save()
  .then(result => { return callback(null, result)})
  .catch(err => callback(err, null));
}



module.exports = [
    {
      name: 'services.unit.create',
      method: createUnit
    },
    {
        name: 'services.unit.read',
        method: listUnit
    },
    // {
    //     name: 'services.unit.update',
    //     method: updateUnit
    // },
    // {
    //     name: 'services.unit.delete',
    //     method: deleteUnit
    // },
];

