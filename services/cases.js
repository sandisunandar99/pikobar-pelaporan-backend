const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/History')
const History = mongoose.model('History')

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')

function ListCase (query, user, callback) {

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
    populate: (['last_history','author']),
    address_district_code: query.address_district_code,
    sort: { createdAt: query.sort },
    leanWithId: true,
    customLabels: myCustomLabels
  };

  var params = new Object();

  if(query.address_district_code){
    params.address_district_code = query.address_district_code;
  }

  if (user.role == 'faskes') {
    params.author = user._id;
  }

  if(query.search){
    var search_params = [
      { id_case : new RegExp(query.search,"i") },
      { name: new RegExp(query.search, "i") },
    ];

    var result_search = Case.find(params).or(search_params).where('delete_status').ne('deleted')
  } else {
    var result_search = Case.find(params).where('delete_status').ne('deleted')
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

function getCaseSummaryFinal (query, callback) {
  var aggStatus = [
    { $match: { delete_status: { $ne: 'deleted' }} },
    {$group: {
      _id: "$final_result",
      total: {$sum: 1}
    }}
  ];

  if (query.address_district_code) {
    var aggStatus = [
      { $match: { 
      $and: [ 
            { address_district_code: query.address_district_code },  
            { delete_status: { $ne: 'deleted' }}
          ]
      }},
      { $group: {
        _id: "$final_result",
        total: {$sum: 1}
      }}
    ];
  }

  let result =  {
    'NEGATIF':0, 
    'SEMBUH':0, 
    'MENINGGAL':0
  }

  Case.aggregate(aggStatus).exec().then(item => {
      item.forEach(function(item){
        if (item['_id'] == '0') {
          result.NEGATIF = item['total']
        }
        if (item['_id'] == '1') {
          result.SEMBUH = item['total']
        }
        if (item['_id'] == '2') {
          result.MENINGGAL = item['total']
        }
      });
      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

function getCaseSummary (query, callback) {
  var aggStatus = [
    { $match: { delete_status: { $ne: 'deleted' }} },
    {$group: {
      _id: "$status",
      total: {$sum: 1}
    }}
  ];

  if (query.address_district_code) {
    var aggStatus = [
      { $match: { 
      $and: [ 
            { address_district_code: query.address_district_code },  
            { delete_status: { $ne: 'deleted' }}
          ]
      }},
      { $group: {
        _id: "$status",
        total: {$sum: 1}
      }}
    ];
  }

  let result =  {
    'ODP':0, 
    'PDP':0, 
    'POSITIF':0, 
    'KONTAKERAT' : 0, 
    'PROBABEL' : 0
  }

  Case.aggregate(aggStatus).exec().then(item => {
      item.forEach(function(item){
        if (item['_id'] == 'ODP') {
          result.ODP = item['total']
        }
        if (item['_id'] == 'PDP') {
          result.PDP = item['total']
        }
        if (item['_id'] == 'POSITIF') {
          result.POSITIF = item['total']
        }
        if (item['_id'] == 'KONTAKERAT') {
          result.KONTAKERAT = item['total']
        }
      });
      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

function createCase (raw_payload, author, pre, callback) {

  let verified 
  if (author.role === "dinkeskota") {
    verified= {
      verified_status: 'verified'
    }
  }else{
    verified = {
      verified_status: 'pending'
    }
  }

  let date = new Date().getFullYear().toString()
  let id_case = "covid-"
      id_case += pre.dinkes_code
      id_case += date.substr(2, 2)
      id_case += "0".repeat(4 - pre.count_pasien.toString().length)
      id_case += pre.count_pasien

  let inset_id_case = Object.assign(raw_payload, verified) //TODO: check is verified is not overwritten ?
      inset_id_case = Object.assign(raw_payload, {id_case})
 
  let item = new Case(Object.assign(inset_id_case, {author}))

  item.save().then(x => { // step 1 : create dan save case baru
    let c = {case: x._id}

    if (raw_payload.current_hospital_id == ""){
      raw_payload.current_hospital_id = null;
    }

    if (raw_payload.first_symptom_date == ""){
      raw_payload.first_symptom_date = Date.now();
    }

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

function updateCase (id, payload, callback) {
  Case.findOneAndUpdate({ _id: id}, { $set: payload }, { new: true })
  .then(result => {
    return callback(null, result);
  }).catch(err => {
    return callback(null, err);
  })
}

function getCountCaseByDistrict(callback) {
  /*
  var summary = {};
  DistrictCity.find().then(district_city => {
    Case.find({ address_district_code: district_city.kemendagri_kabupaten_kode }).then( res => {
      summary[district_city.name] = res.length();
    })
    .catch(err => callback(err, null));
  })
  .catch(err => callback(err, null));

  return callback(null, summary);

  var res = DistrictCity.collection.aggregate([
    {"$group": { _id: "$address_district_code", count: {$sum:1}}}
  ])
  return callback(null, res.toArray());
  */
  var aggStatus = [
    { $match: { delete_status: { $ne: 'deleted' }} },
    {$group: {
      _id: "$address_district_code",
      total: {$sum: 1}
    }}
  ];

  let result =  {}

  Case.aggregate(aggStatus).exec().then(item => {
      item.forEach(function(item){
        result[item['_id']] = item['total']
      });
      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

function getCountByDistrict(code, callback) {
  /* Get last number of current district id case order */
  DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
              .exec()
              .then(dinkes =>{
                Case.find({ address_district_code: code})
                    .sort({id_case: -1})
                    .exec()
                    .then(res =>{
                        let count = 1;
                        if (res.length > 0)
                          // ambil 4 karakter terakhir yg merupakan nomor urut dari id_case
                          count = (Number(res[0].id_case.substring(12)) + 1);
                        let result = {
                          prov_city_code: code,
                          dinkes_code: dinkes.dinkes_kota_kode,
                          count_pasien: count
                        }
                      return callback(null, result)
                    }).catch(err => callback(err, null))
              })
}


function softDeleteCase(cases,deletedBy, payload, callback) {
   let date = new Date()
   let dates = {
     delete_status: 'deleted',
     deletedAt: date.toISOString()
   }
   let param = Object.assign({deletedBy}, dates)

   cases = Object.assign(cases, param)
   cases.save((err, item) => {
     if (err) return callback(err, null)
     return callback(null, item)
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
    name: 'services.cases.GetSummaryFinal',
    method: getCaseSummaryFinal
  },
  {
    name: 'services.cases.getSummaryByDistrict',
    method: getCountCaseByDistrict
  },  
  {
    name: 'services.cases.create',
    method: createCase
  },
  {
    name: 'services.cases.update',
    method: updateCase
  },
  {
    name: 'services.cases.getCountByDistrict',
    method: getCountByDistrict
  },
  {
    name: 'services.cases.softDeleteCase',
    method: softDeleteCase
  }
];

