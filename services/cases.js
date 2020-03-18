const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

case_fields = [
  'id_case',
  'id_case_national',
  'id_case_related',
  'name',
  'birth_date',
  'age',
  'gender',
  'phone_number',
  'address_street',
  'address_village_code',
  'address_village_name',
  'address_subdistrict_code',
  'address_subdistrict_name',
  'address_district_code',
  'address_district_name',
  'address_province_name',
  'nationality',
  'current_location_address',
  'occupation',
  'last_status',
  'last_stage',
  'last_result',
  'last_history',
  'author',
]

function clean_input(payload) {
    // date cleanup
    [ 'birth_date'].forEach(function(field) {
        if (payload.hasOwnProperty(field) && payload[field] != null)
            payload[field] = new Date(payload[field]).toISOString();
    });
    //uppercase clean up
    [ 'gender'].forEach(function(field) {
        if (payload.hasOwnProperty(field) && payload[field] != null)
            payload[field] = payload[field].toUpperCase();
    });

    return payload;
}

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
    sort: { createdAt: query.sort },
    leanWithId: true,
    customLabels: myCustomLabels
  };

  let query_search = new RegExp(query.search, "i")
  let result_search = Case.find({ name: query_search })

  Case.paginate(result_search, options).then(function(results){
      let res = { 
        cases: results.itemsList.map(cases => cases.toJSONFor()),
        _meta: results._meta
      }
      return callback(null, res)
  }).catch(err => callback(err, null))
}

function getCaseById (id_case, callback) {
  Case.findOne({ id_case: id_case})
    // .populate('author')
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
  let item = new Case();
  let payload = clean_input(raw_payload);

  case_fields.forEach(function(field) {
      item[field] = payload[field];
  })

  item.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
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

