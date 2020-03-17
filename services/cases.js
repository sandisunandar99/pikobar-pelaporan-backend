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

function getCaseById (id_code, callback) {
  Case.findOne({ id: id_code}).exec().then(item => {
        return callback(null, item.toJSONFor())
    })
    .catch(err => callback(err, null))
}

function createCase (payload, callback) {
  let item = new Case();
  
  item.id = payload.id;
  item.id_info = payload.id_info;
  item.name = payload.name;
  item.birth_date = new Date(Date.parse(payload.birth_date));
  item.age = payload.age;
  item.gender = payload.gender;
  item.phone_number = payload.phone_number;
  item.address_street = payload.address_street;
  item.address_village_code = payload.address_village_code;
  item.address_subdistrict_code = payload.address_subdistrict_code;
  item.address_district_code = payload.address_district_code;
  item.address_province_code = payload.address_province_code;
  item.nationality = payload.nationality;
  item.occupation = payload.occupation;
  item.cache_status  = payload.cache_status;
  item.cache_stage  = payload.cache_stage;
  item.cache_result  = payload.cache_result;
  item.cache_last_change  = payload.cache_last_change;
  item.id_author  = payload.id_author;

  item.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
}

function updateCase (id, payload, callback) {
  //let item = getCaseById(id, callback);
  Case.findOne({ id: id}).exec().then(item => {
      if (item.name != payload.name)
          item.name = payload.name;

      if (item.birth_date != payload.birth_date)
          item.birth_date = payload.birth_date;

      if (item.age != payload.age)
          item.age = payload.age;

      if (item.gender != payload.gender)
          item.gender = payload.gender;

      if (item.phone_number != payload.phone_number)
          item.phone_number = payload.phone_number;

      if (item.address_street != payload.address_street)
          item.address_street = payload.address_street;

      if (item.address_village_code != payload.address_village_code)
          item.address_village_code = payload.address_village_code;

      if (item.address_subdistrict_code != payload.address_subdistrict_code)
          item.address_subdistrict_code = payload.address_subdistrict_code;

      if (item.address_district_code != payload.address_district_code)
          item.address_district_code = payload.address_district_code;

      if (item.address_province_code != payload.address_province_code)
          item.address_province_code = payload.address_province_code;

      item.save((err, item) => {
        if (err) return callback(err, null);
        return callback(null, item);
      });
    })
    .catch(err => callback(err, null))

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
 
