const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/History')
const History = mongoose.model('History')

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')

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
    populate: ('last_history'),
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

function getCaseSummary (query, callback) {
  let param = {}

  if (query){
      param = { address_district_code: query.address_district_code }
  }

  Case.find(param)
      .populate('last_history')
      .exec()
      .then(x =>{
          let ODP = 0
          let PDP = 0
          let POSITIF = 0

          x.forEach((val)=>{
            if (val.last_history !== null) {
              if (val.last_history.status === 'ODP') {
                ODP++
              } else if (val.last_history.status === 'PDP') {
                PDP++
              } else if (val.last_history.status === 'POSITIF') {
                POSITIF++
              }     
            }
          })

        return callback(null, {
          ODP: ODP,
          PDP: PDP,
          POSITIF: POSITIF
        })
      })
      .catch(err => callback(err, null))
}

function createCase (raw_payload, author, pre, callback) {

  let date = new Date().getFullYear().toString()
  let id_case = "Covid-"
      id_case += pre.dinkes_code
      id_case += date.substr(2, 2)
      id_case += "0".repeat(4 - pre.count_pasien.toString().length)
      id_case += pre.count_pasien

  let inset_id_case = Object.assign(raw_payload, {id_case})
  let item = new Case(Object.assign(inset_id_case, {author}))

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

function updateCase (id, payload, callback) {
  Case.findOneAndUpdate({ _id: id}, { $set: payload }, { new: true })
  .then(result => {
    return callback(null, result);
  }).catch(err => {
    return callback(null, err);
  })
}

function getCountByDistrict(code, callback) {
  DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
              .exec()
              .then(dinkes =>{
                Case.find({ address_district_code: code})
                    .sort({id_case: -1})
                    .exec()
                    .then(res =>{
                      console.log(res.length);
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
  },
  {
    name: 'services.cases.getCountByDistrict',
    method: getCountByDistrict
  }
];

