const mongoose = require('mongoose');


require('../models/Category');
const Category = mongoose.model('Category');
require('../models/Specimen')
const Specimen = mongoose.model('Specimen');

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

function createCategory(request, callback){
  const category = new Category(request.payload);
  category.save()
  .then(result => { return callback(null, result)})
  .catch(err => callback(err, null));
}

function typeSpeciment(callback){
    Specimen.find({})
            .exec()
            .then((result)=>{
              let res = result.map(q => q.toJSONFor())
              return callback(null, res)
            }).catch(err => callback(err, null))
}


module.exports = [
  {
    name: 'services.category.list',
    method: listTarget
  },
  {
    name: 'services.category.listTargetByCategory',
    method: listTargetByCategory
  },
  {
    name: 'services.category.create',
    method: createCategory
  },
  {
    name: 'services.category.typeSpeciment',
    method: typeSpeciment
  },
];

