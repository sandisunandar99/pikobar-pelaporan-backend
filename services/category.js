const mongoose = require('mongoose');

require('../models/Category');
const Category = mongoose.model('Category');

function listTarget(callback) {
    Category.find()
    .then(result => {
        let res = result.map(q => q.toJSONForTarget())
        return callback(null, res)
    })
    .catch(err => callback(err, null));
}

function listTargetByCategory (category_name,callback) {
    Category.find({category_name: category_name})
    .then(result => {
        let res = result.map(q => q.toJSONForTarget())
        return callback(null, res)
    })
    .catch(err => callback(err, null));
}

module.exports = [
  {
    name: 'services.category.list',
    method: listTarget
  },
  {
    name: 'services.category.listbytarget',
    method: listTargetByCategory
  },
];

