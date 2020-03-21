const mongoose = require('mongoose');

require('../models/History');
require('../models/Hospital')
require('../models/Case');

const History = mongoose.model('History');
const Hospital = mongoose.model('Hospital')
const Case = mongoose.model('Case');

function ListHistory (callback) {
    History.find()
        .sort({ createdAt: 'desc'})
        .exec()
        .then(item => {
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
  History.find({ case: id_case})
        .sort({ createdAt: 'desc'})
        .exec()
        .then(item => {
        let res = item.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function getLastHistoryByIdCase (id_case, callback) {
  History.find({ case: id_case})
        .sort({ createdAt: 'desc'})
        .limit(1)
        .exec()
        .then(item => {
        let res = item.map(q => q.toJSONFor())
        return callback(null, res)
    })
    .catch(err => callback(err, null))
}

function createHistory (payload, callback) {
  let item = new History(payload);

  item.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
}

function createHistoryIfChanged (payload, callback) {
  /* Create history only if new history and last_history of the related case
   * has difference. If the same would just return the old history. If there
   * are any difference, would create a new history, then update the related
   * case's last_history to the newly created history. */
  Case.findById(payload.case).exec().then(case_obj => {
    History.findById(case_obj.last_history).exec().then(old_history => {
      let new_history = new History(payload);
      let changed = false, changed_fields=[];

      function is_same(a,b) {
        /* Method to compare equality between 2 object. support Date object,
         * array, and generic object */
        if (typeof a == 'undefined' || typeof b == 'undefined')
          return false;
        if (a instanceof Date)
          return a.getTime() == b.getTime();
        if (Array.isArray(a))
          return JSON.stringify(a) == JSON.stringify(b);
        if (typeof(a) == 'object')
          return String(a) == String(b);
        return a == b;
      }

      for (var property in payload) {
          if (new_history[property] != null && !is_same(new_history[property],  old_history[property])) {
            console.log('changed',property, new_history[property], old_history[property]);
            changed = true;
            changed_fields.push(property);
          }
      }

      if (changed) {
        if (new_history.current_location_type.toUpperCase() == 'RS') {
          Hospital.findById(new_history.current_hospital_id)
                  .exec()
                  .then(found_hospital => {
                    new_history.current_location_district_code = found_hospital.kemendagri_kabupaten_kode;
                    new_history.current_location_subdistrict_code = found_hospital.kemendagri_kecamatan_kode;
                    new_history.current_location_village_code = found_hospital.kemendagri_kelurahan_kode;

                    new_history.save((err, item) => {
                      if (err) return callback(err, null);

                      // update case
                      Object.assign(case_obj, {last_history: item._id});
                      case_obj.save((err, updated_case) => {
                        if (err) return callback(err, null);
                        return callback(null, new_history);
                      });
                    });
                  })
                  .catch(err => callback(err, null))
        } else  { // if current_location_type != RS
          new_history.save((err, item) => {
            if (err) return callback(err, null);

            // update case
            Object.assign(case_obj, {last_history: item._id});
            case_obj.save((err, updated_case) => {
              if (err) return callback(err, null);
              return callback(null, new_history);
            });
          });
        } // --- end if current_location_type != RS
      } else
        // return old history if not changed
        return callback(null, old_history);
    })
    .catch(err => callback(err, null))
  })
  .catch(err => callback(err, null))

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
    name: 'services.histories.getLastHistoryByIdCase',
    method: getLastHistoryByIdCase
  },


  {
    name: 'services.histories.create',
    method: createHistory
  },
  {
    name: 'services.histories.createIfChanged',
    method: createHistoryIfChanged
  },
  {
    name: 'services.histories.delete',
    method: deleteHistory
  }
];

