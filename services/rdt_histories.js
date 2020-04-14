const mongoose = require('mongoose');

require('../models/RdtHistory');

const RdtHistory = mongoose.model('History');

function ListRdtHistory (callback) {
    RdtHistory.find()
        .sort({ createdAt: 'desc'})
        .exec()
        .then(item => {
            let res = item.map(q => q.toJSONFor())
            return callback(null, res)
        })
        .catch(err => callback(err, null))
}

function getRdtHistoryById (id, callback) {
  RdtHistory.findById(id).exec().then(item => {
    return callback(null, item.toJSONFor())
  })
  .catch(err => callback(err, null))
}

function createRdtHistory (payload, callback) {
  let item = new RdtHistory(payload);

  item.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
}

module.exports = [
  {
    name: 'services.rdt_histories.list',
    method: ListRdtHistory
  },
  {
    name: 'services.rdt_histories.getById',
    method: getRdtHistoryById
  },
];

