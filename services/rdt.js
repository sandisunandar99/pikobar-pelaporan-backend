const mongoose = require('mongoose');

require('../models/Rdt');
const Rdt = mongoose.model('Rdt');

require('../models/History')
const History = mongoose.model('History')

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')

require('../models/Case')
const Case = mongoose.model('Case')

function ListRdt (query, user, callback) {

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
    populate: ( 'author'),
    address_district_code: query.address_district_code,
    sort: {
      createdAt: query.sort
    },
    leanWithId: true,
    customLabels: myCustomLabels
  };

  var params = new Object();

  if (query.address_district_code) {
    params.address_district_code = query.address_district_code;
    params.author = user._id;
  }

  if (query.search) {
    var search_params = [{
        code_test: new RegExp(query.search, "i")
      },
      {
        name: new RegExp(query.search, "i")
      },
    ];

    if (user.role == 'dinkeskota') {
      var result_search = Rdt.find(params).or(search_params).where('status').ne('deleted')
    } else if (user.role == 'dinkesprov' || user.role == 'superadmin') {
      var result_search = Rdt.find().or(search_params).where('status').ne('deleted')
    } else {
      var result_search = Rdt.find({
        'author': user._id
      }).or(search_params).where('status').ne('deleted')
    }
  } else {
    if (user.role == 'dinkeskota') {
      var result_search = Rdt.find(params).where('status').ne('deleted')
    } else if (user.role == 'dinkesprov' || user.role == 'superadmin') {
      var result_search = Rdt.find().where('status').ne('deleted')
    } else {
      var result_search = Rdt.find({
        'author': user._id
      }).where('status').ne('deleted')
    }
  }

  Rdt.paginate(result_search, options).then(function (results) {
    let res = {
      rdt: results.itemsList.map(rdt => rdt.toJSONFor()),
      _meta: results._meta
    }
    return callback(null, res)
  }).catch(err => callback(err, null))
}

function getRdtById (id, callback) {
  Rdt.findOne({_id: id})
    .populate('author')
    .exec()
    .then(rdt => {
        return callback(null, rdt)
    })
    .catch(err => callback(err, null));
}

function getRdtSummary (query, callback) {
  var aggStatus = [
    { $match: { status: { $ne: 'deleted' }} },
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
            { status: { $ne: 'deleted' }}
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

  Rdt.aggregate(aggStatus).exec().then(item => {
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

function createRdt (payload, author, pre, callback) {
  // "code_test": "PST-100012000001"
  // "code_tool_tester": "RDT-10012000001",
  // "code_tool_tester": "PCR-10012000001",  

  let date = new Date().getFullYear().toString()
  let code_test = "PTS-"
      code_test += pre.code_dinkes.code
      code_test += date.substr(2, 2)
      code_test += "0".repeat(5 - pre.count_rdt.count.toString().length)
      code_test += pre.count_rdt.count

  let code_tool_tester
  if (payload.tool_tester === "PCR") {
    code_tool_tester = "PCR-"
  }else{
    code_tool_tester = "RDT-"
  }
  code_tool_tester += pre.code_dinkes.code
  code_tool_tester += date.substr(2, 2)
  code_tool_tester += "0".repeat(5 - pre.count_rdt.count.toString().length)
  code_tool_tester += pre.count_rdt.count
  
  let code = {
    code_test: code_test,
    code_tool_tester: code_tool_tester
  }

  let rdt = new Rdt(Object.assign(code, payload))
  rdt = Object.assign(rdt,{author})

  rdt.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
}

function updateRdt (id, payload, author, callback) {
  // update Rdt
  Rdt.findOne({ _id: id}).then(rdt_item => {
     rdt_item = Object.assign(rdt_item, payload);

     rdt_item.save((err, res) => {
       if (err) return callback(err, null);
       return callback(null, rdt_item);
     });
  }).catch(err => callback(err, null))
}

function getCountRdtCode(code,callback) {

    DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
              .exec()
              .then(dinkes =>{
                    Rdt.find({ address_district_code: code})
                      .sort({code_test: -1})
                      .exec()
                      .then(res =>{

                          let count = 1;
                          if (res.length > 0){
                            // ambil 5 karakter terakhir yg merupakan nomor urut dari id_rdt
                            let str = res[0].code_test
                            count = (Number(str.substring(10)) + 1)
                          }
                            
                          let result = {
                            prov_city_code: code,
                            dinkes_code: dinkes.dinkes_kota_kode,
                            count: count
                          }
                        return callback(null, result)
                      }).catch(err => callback(err, null))
              })


}

function softDeleteRdt(rdt, deletedBy, callback) {
    let date = new Date()
    let dates = {
        status: 'deleted',
        deletedAt: date.toISOString()
      }
    let param = Object.assign({deletedBy}, dates)

    rdt = Object.assign(rdt, param)

    rdt.save((err, item) => {
      if (err) return callback(err, null)
      return callback(null, item)
    })


}

function getCodeDinkes(code, callback) {
  DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
              .exec()
              .then(dinkes =>{
                 let result = {
                   prov_city_code: code,
                   code: dinkes.dinkes_kota_kode,
                 }
                 return callback(null, result)
              })
}


module.exports = [
  {
    name: 'services.rdt.list',
    method: ListRdt
  },
  {
    name: 'services.rdt.getById',
    method: getRdtById
  },
  {
    name: 'services.rdt.create',
    method: createRdt
  },
  {
    name: 'services.rdt.update',
    method: updateRdt
  },
  {
    name: 'services.rdt.softDeleteRdt',
    method: softDeleteRdt
  },
  {
    name: 'services.rdt.getCountRdtCode',
    method: getCountRdtCode
  },
  {
    name: 'services.rdt.getSummary',
    method: getRdtSummary
  },
  {
    name: 'services.rdt.getCodeDinkes',
    method: getCodeDinkes
  },

];

