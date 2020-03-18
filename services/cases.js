const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/History')
const History = mongoose.model('History')

function ListCase (query,callback) {

  const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    meta: '_meta'
  }; 

  const options = {
    page: query.page,
    limit: query.limit,
    address_district_code: query.address_district_code,
    sort: { createdAt: query.sort },
    leanWithId: true,
    customLabels: myCustomLabels
  };

  let query_search = new RegExp(query.search, "i")

  if(query.address_district_code){
    var result_search = Case.find({ address_district_code: query.address_district_code })
  }else{
    var result_search = Case.find({ name: query_search })
  }

  Case.paginate(result_search, options).then(function(results){
      let res = { 
        cases: results.itemsList.map(cases => cases.toJSONFor()),
        _meta: results._meta
      }
      return callback(null, res)
  }).catch(err => callback(err, null))
}

function getCaseById (id, callback) {
  Case.findOne({_id: id})
    .populate('author')
    .populate('last_history')
    .exec()
    .then(cases => callback (null, cases))
    .catch(err => callback(err, null));
}


function getCaseSummary (callback) {
  var agg = [
    {$group: {
      _id: "$last_status",
      total: {$sum: 1}
    }}
  ];

  Case.aggregate(agg).exec().then(item => {
        return callback(null, item)
    })
    .catch(err => callback(err, null))
}

function createCase (raw_payload, author, callback) { 
  let item = new Case(Object.assign(raw_payload, {author}))

  item.save().then(x => { // step 1 : create dan save case baru
    let c = {case: x._id}
    let history = new History(Object.assign(raw_payload, c))
    history.save().then(last => { // step 2: create dan save historuy baru jangan lupa di ambil object id case
      let last_history = { last_history: last._id }
      x = Object.assign(x, last_history)
      x.save().then(final =>{ // step 3: udpate last_history di case ambil object ID nya hitory
        return callback(null, final)
      })
    })
   }).catch(err => callback(err, null))
}

function updateCase (id_case, payload, callback) {
  Case.findOneAndUpdate({ id_case: id_case}, { $set: clean_input(payload) }, { new: true })
  .then(result => {
    return callback(null, result);
  }).catch(err => {
    return callback(null, err);
  })
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
    name: 'services.cases.getSummary',
    method: getCaseSummary
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

