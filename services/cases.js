const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

function ListCase (callback) {
    Case.find().exec().then(item => {
        let res = item.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getCaseById (id, callback) {
  Case.findById(id).exec().then(item => {
        return callback(null, item.toJSONFor())
    })
    .catch(err => callback(err, null))

}

function createCase (payload, callback) {
  let item = new Case();
  
  item.id = payload.id;
  item.name = item.name;
  item.birth_date = item.birth_date;
  item.age = item.age;
  item.gender = item.gender;
  item.phone_number = item.phone_number;
  item.address_street = item.address_street;
  item.address_province_code = item.address_province_code;
  item.address_city_code = item.address_city_code;

  item.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
}

function updateCase (item, payload, callback) {
  if (item.name != item.name)
      item.name = item.name;

  if (item.birth_date != item.birth_date)
      item.birth_date = item.birth_date;

  if (item.age != item.age)
      item.age = item.age;

  if (item.gender != item.gender)
      item.gender = item.gender;

  if (item.phone_number != item.phone_number)
      item.phone_number = item.phone_number;

  if (item.address_street != item.address_street)
      item.address_street = item.address_street;

  if (item.address_province_code != item.address_province_code)
      item.address_province_code = item.address_province_code;

  if (item.address_city_code != item.address_city_code)
      item.address_city_code = item.address_city_code;

  item.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
}



module.exports = [
  {
    name: 'services.cases.list',
    method: ListCase
  },
  {
    name: 'services.cases.getById',
    method: getCaseById
  },
  {
    name: 'services.cases.create',
    method: createCase
  },
  {
    name: 'services.cases.update',
    method: updateCase
  }
];
 
