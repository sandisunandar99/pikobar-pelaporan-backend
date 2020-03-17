const mongoose = require('mongoose');

require('../models/History');
const History = mongoose.model('History');

function ListHistory (callback) {
    History.find().exec().then(item => {
        let res = item.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getHistoryById (id, callback) {
  History.findById(id).exec().then(item => {
        return callback(null, item.toJSONFor())
    })
    .catch(err => callback(err, null))
}

function getHistoryByCase (id_case, callback) {
  History.find({ case: id_case}).exec().then(item => {
        let res = item.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function createHistory (payload, callback) {
  let item = new History();
  
  item.case = payload.case;
  item.status = payload.status;
  item.symptoms = payload.symptoms;
  item.stage = payload.stage;
  item.result = payload.result;
  item.history_trace = payload.history_trace;
  item.return_date = payload.return_date;
  item.history_note =payload.history_note;
  item.current_location_type = payload.current_location_type;
  item.current_location_village_code = payload.current_location_village_code;
  item.current_location_district_code = payload.current_location_district_code;
  item.current_location_subdistrict_code = payload.current_location_subdistrict_code;
  item.current_location_province_code = payload.current_location_province_code;
  item.last_changed = payload.last_changed;

  item.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
}

function deleteHistory (id, callback) {
  //let item = getCaseById(id, callback);
  History.findOne({ case: id}).exec().then(item => {

      item.save((err, item) => {
        if (err) return callback(err, null);
        return callback(null, item);
      });
    })
    .catch(err => callback(err, null))
}

module.exports = [
  {
    name: 'services.histories.list',
    method: ListHistory
  },
  {
    name: 'services.histories.getById',
    method: getHistoryById
  },
  {
    name: 'services.histories.getByCase',
    method: getHistoryByCase
  },
  {
    name: 'services.histories.create',
    method: createHistory
  },
  {
    name: 'services.histories.delete',
    method: deleteHistory
  }
];
 
