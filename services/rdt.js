const mongoose = require('mongoose');

require('../models/Rdt');
const Rdt = mongoose.model('Rdt');

require('../models/History')
const History = mongoose.model('History')

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')

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
      { code_rdt : new RegExp(query.search,"i") },
      { name: new RegExp(query.search, "i") },
    ];

    var result_search = Rdt.find(params).or(search_params).where('status').ne('deleted')
  } else {
    var result_search = Rdt.find(params).where('status').ne('deleted')
  }

  Rdt.paginate(result_search, options).then(function(results){
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
    .populate('last_history')
    .exec()
    .then(rdt => callback (null, rdt))
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
  let item = new Rdt(payload);
  item.created_by = author._id;
  item.created_by_name = author.fullname;
  item.updated_by = author._id;
  item.updated_by_name = author.fullname;

  console.log("author",author);

  item.save((err, item) => {
    if (err) return callback(err, null);
    return callback(null, item);
  });
}

function updateRdt (id, payload, callback) {
  Rdt.findOneAndUpdate({ _id: id}, { $set: payload }, { new: true })
  .then(result => {
    return callback(null, result);
  }).catch(err => {
    return callback(null, err);
  })
}

function getCountByDistrict(code, callback) {
  /* Get last number of current district id rdt order */
  DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
              .exec()
              .then(dinkes =>{
                Rdt.find({ address_district_code: code})
                    .sort({code_rdt: -1})
                    .exec()
                    .then(res =>{
                        let count = 1;
                        if (res.length > 0)
                          // ambil 4 karakter terakhir yg merupakan nomor urut dari code_rdt
                          count = (Number(res[0].code_rdt.substring(12)) + 1);
                        let result = {
                          prov_city_code: code,
                          dinkes_code: dinkes.dinkes_kota_kode,
                          count_pasien: count
                        }
                      return callback(null, result)
                    }).catch(err => callback(err, null))
              })
}


function softDeleteRdt(rdt,deletedBy, payload, callback) {
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
    name: 'services.rdt.getCountByDistrict',
    method: getCountByDistrict
  },
  {
    name: 'services.rdt.getSummary',
    method: getRdtSummary
  },

];

