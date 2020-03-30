const mongoose = require('mongoose');

require('../models/Category');
const Category = mongoose.model('Category');

function listCategory (request,callback) {
    if(request){
        Category.find({category_name: request.category_name})
        .exec()
        .then(result => {
            let res = result.map(q => q.toJSONForTarget())
            return callback(null, res)
        })
        .catch(err => callback(err, null));
    }else{
        Category.find()
        .sort({ seq: 'asc' })
        .exec()
        .then(result => {
            let res = result.map(q => q.toJSONForCategory())
            return callback(null, res)
        })
        .catch(err => callback(err, null))
    }
}

module.exports = [
  {
    name: 'services.category.list',
    method: listCategory
  }
];

