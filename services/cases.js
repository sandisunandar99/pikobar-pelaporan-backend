const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/Hospital');
const Hospital = mongoose.model('Hospital');

require('../models/History')
const History = mongoose.model('History')

require('../models/User')
const User = mongoose.model('User')

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')
const ObjectId = require('mongoose').Types.ObjectId; 
const Check = require('../helpers/rolecheck')

async function ListCase (query, user, callback) {

  const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    meta: '_meta'
  };

  const sorts = (query.sort == "desc" ? {createdAt:"desc"} : JSON.parse(query.sort))
  
  const options = {
    page: query.page,
    limit: query.limit,
    populate: (['last_history','author']),
    sort: sorts,
    leanWithId: true,
    customLabels: myCustomLabels
  };

  var params = {}

  if(user.role == "dinkesprov" || user.role == "superadmin"){
    if(query.address_district_code){
      params.address_district_code = query.address_district_code;
    }
  }
  if(query.address_village_code){
    params.address_village_code = query.address_village_code;
  }
  if(query.address_subdistrict_code){
    params.address_subdistrict_code = query.address_subdistrict_code;
  }
  if(query.start_date && query.end_date){
    params.createdAt = {
      "$gte": new Date(new Date(query.start_date)).setHours(00, 00, 00),
      "$lt": new Date(new Date(query.end_date)).setHours(23, 59, 59)
    }
  }
  if(query.status){
    params.status = query.status;
  }
  if(query.final_result){
    params.final_result = query.final_result;
  }
  if(query.author){
    params.author = query.author;
  }

  if (query.verified_status && query.verified_status.split) {
    const verified_status = query.verified_status.split(',')
    params.verified_status = { $in: verified_status }
    
    if (['pending','declined'].some(v => verified_status.includes(v))) {
      options.sort.createdAt = 'asc'
    }
  }
  
  if(query.search){
    var search_params = [
      { id_case : new RegExp(query.search,"i") },
      { name: new RegExp(query.search, "i") },
      { nik: new RegExp(query.search, "i") }
    ];

    if (query.verified_status !== 'verified') {
      let users = await User.find({username: new RegExp(query.search,"i"), code_district_city: user.code_district_city}).select('_id')
      search_params.push({ author: { $in: users.map(obj => obj._id) } })
    }

    var result_search = Check.listByRole(user, params, search_params,Case,"delete_status")
  } else {
    var result_search = Check.listByRole(user, params, null,Case,"delete_status")
  }

  Case.paginate(result_search, options).then(function(results){
      let res = {
        cases: results.itemsList.map(cases => cases.toJSONFor()),
        _meta: results._meta
      }
      return callback(null, res)
  }).catch(err => callback(err, null))
}

function listCaseExport (query, user, callback) {
  const params = {}
  
  if(query.start_date && query.end_date){
    params.createdAt = {
      "$gte": new Date(new Date(query.start_date)).setHours(00, 00, 00),
      "$lt": new Date(new Date(query.end_date)).setHours(23, 59, 59)
    }
  }
  
  Check.exportByRole(params,user,query)

  if(query.status){
    params.status = query.status;
  }
  if(query.final_result){
    params.final_result = query.final_result;
  }
  if(user.role == "dinkesprov" || user.role == "superadmin"){
    if(query.address_district_code){
      params.address_district_code = query.address_district_code;
    }
  }
  if(query.address_village_code){
    params.address_village_code = query.address_village_code;
  }
  if(query.address_subdistrict_code){
    params.address_subdistrict_code = query.address_subdistrict_code;
  }
  if (query.verified_status && query.verified_status.split) {
    params.verified_status = { $in: query.verified_status.split(',') }
  }
  if(query.search){
    var search_params = [
      { id_case : new RegExp(query.search,"i") },
      { name: new RegExp(query.search, "i") },
    ];
    var search = search_params
  } else {
    var search = {}
  }
  Case.find(params)
    .where('delete_status').ne('deleted')
    .or(search)
    .populate('author').populate('last_history')
    .exec()
    .then(cases => callback (null, cases.map(cases => cases.JSONExcellOutput())))
    .catch(err => callback(err, null));
}

function getCaseById (id, callback) {
  Case.findOne({_id: id})
    .populate('author')
    .populate('last_history')
    .exec()
    .then(cases => callback (null, cases))
    .catch(err => callback(err, null));
}

function getCaseByNik (nik, callback) {
  Case.findOne({nik: nik})
    .where('delete_status').ne('deleted')
    .populate('author')
    .populate('last_history')
    .then(cases => callback (null, cases))
    .catch(err => callback(err, null));
}

function getIdCase (query,callback) {
  const params = {}
  if(query.name_case_related){
    params.name = new RegExp(query.name_case_related, "i");
  }
  Case.find(params).select('id_case name')
  .where('delete_status').ne('deleted')
  .then(cases => callback (null, cases.map(cases => cases.JSONFormIdCase())))
  .catch(err => callback(err, null));
}

async function getCaseSummaryFinal (query, user, callback) {
  let searching = Check.countByRole(user);

  if(query.address_village_code){
    searching.address_village_code = query.address_village_code;
  }
  if(query.address_subdistrict_code){
    searching.address_subdistrict_code = query.address_subdistrict_code;
  }

  if(user.role == "dinkesprov" || user.role == "superadmin"){
    if(query.address_district_code){
      searching.address_district_code = query.address_district_code;
    }
  }

  const searchingPositif = {status:"POSITIF", final_result : { $nin: [1,2] }}
  const searchingSembuh = {status:"POSITIF",final_result:1}
  const searchingMeninggal = {status:"POSITIF",final_result:2}
  
  try {
    const positif = await Case.find(Object.assign(searching,searchingPositif))
    .where("delete_status").ne("deleted").and({verified_status: 'verified'}).countDocuments()
    const sembuh = await Case.find(Object.assign(searching,searchingSembuh))
    .where("delete_status").ne("deleted").and({verified_status: 'verified'}).countDocuments()
    const meninggal = await Case.find(Object.assign(searching,searchingMeninggal))
    .where("delete_status").ne("deleted").and({verified_status: 'verified'}).countDocuments()
    const result =  {
      "SEMBUH":sembuh, 
      "MENINGGAL":meninggal,
      "POSITIF":positif
    }
    callback(null,result)
  } catch (error) {
    callback(error, null)
  }
}

async function getCaseSummary (query, user, callback) {
  let searching = Check.countByRole(user,query);
  if(user.role == "dinkesprov" || user.role == "superadmin"){
    if(query.address_district_code){
      searching.address_district_code = query.address_district_code;
    }
  }

  if(query.address_village_code){
    searching.address_village_code = query.address_village_code;
  }

  if(query.address_subdistrict_code){
    searching.address_subdistrict_code = query.address_subdistrict_code;
  }
  
  var aggStatus = [
    { $match: { 
      $and: [  searching, { delete_status: { $ne: 'deleted' }, verified_status: 'verified' } ]
    }},
    { 
      $group: { _id: "$status", total: {$sum: 1}}
    }
  ];

  let result =  {
    'OTG':0, 
    'OTG_PROCESS':0,
    'OTG_DONE':0,
    'ODP':0, 
    'ODP_PROCESS':0,
    'ODP_DONE':0,
    'PDP':0, 
    'PDP_PROCESS':0,
    'PDP_DONE':0,
    'POSITIF':0, 
    'KONTAKERAT' : 0, 
    'PROBABEL' : 0
  }
  Case.aggregate(aggStatus).exec().then(async item => {
      item.forEach(function(item){
        if (item['_id'] == 'OTG') {
          result.OTG = item['total']
        }
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
      
      // OTG 
      result.OTG_PROCESS = await Case.find(Object.assign(searching,{"status":"OTG", $or:[{'stage':0}, {'stage':'Proses'}], "verified_status": "verified","delete_status": { $ne: "deleted" }})).countDocuments();
      result.OTG_DONE = await Case.find(Object.assign(searching,{"status":"OTG",$or:[{'stage':1}, {'stage':'Selesai'}], "verified_status": "verified", "delete_status": { $ne: "deleted" }})).countDocuments();

      // ODP
      result.ODP_PROCESS = await Case.find(Object.assign(searching,{"status":"ODP",$or:[{'stage':0}, {'stage':'Proses'}], "verified_status": "verified", "delete_status": { $ne: "deleted" }})).countDocuments();
      result.ODP_DONE = await Case.find(Object.assign(searching,{"status":"ODP",$or:[{'stage':1}, {'stage':'Selesai'}], "verified_status": "verified", "delete_status": { $ne: "deleted" }})).countDocuments();

      // PDP
      result.PDP_PROCESS = await Case.find(Object.assign(searching,{"status":"PDP",$or:[{'stage':0}, {'stage':'Proses'}], "verified_status": "verified", "delete_status": { $ne: "deleted" }})).countDocuments();
      result.PDP_DONE = await Case.find(Object.assign(searching,{"status":"PDP",$or:[{'stage':1}, {'stage':'Selesai'}], "verified_status": "verified", "delete_status": { $ne: "deleted" }})).countDocuments();

      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

function createCase (raw_payload, author, pre, callback) {

  let verified  = {
    verified_status: 'verified'
  }

  if (author.role === "faskes") {
    verified.verified_status = 'pending'
  }

  let date = new Date().getFullYear().toString()
  let id_case

  if (author.role === 'faskes') {
    id_case = "precovid-"
    id_case += pre.count_case_pending.dinkes_code
    id_case += date.substr(2, 2)
    id_case += "0".repeat(5 - pre.count_case_pending.count_pasien.toString().length)
    id_case += pre.count_case_pending.count_pasien 
  } else {
    id_case = "covid-"
    id_case += pre.count_case.dinkes_code
    id_case += date.substr(2, 2)
    id_case += "0".repeat(4 - pre.count_case.count_pasien.toString().length)
    id_case += pre.count_case.count_pasien
  }

  let insert_id_case = Object.assign(raw_payload, verified) //TODO: check is verified is not overwritten ?
      insert_id_case = Object.assign(raw_payload, {id_case})
  
  insert_id_case.author_district_code = author.code_district_city
  insert_id_case.author_district_name = author.name_district_city

  let item = new Case(Object.assign(insert_id_case, {author}))

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

function updateCase (id, author, payload, callback) {

  payload.author_district_code = author.code_district_city
  payload.author_district_name = author.name_district_city

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
      _id: "$address_district_name",
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
                Case.find({ address_district_code: code, verified_status: 'verified' })
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

function getCountPendingByDistrict(code, callback) {
  /* Get last number of current district id case order */
  DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
              .exec()
              .then(dinkes =>{
                Case.find({ address_district_code: code, verified_status: { $in: ['pending', 'declined'] } })
                    .sort({id_case: -1})
                    .exec()
                    .then(res =>{
                        let count = 1;
                        if (res.length > 0)
                          // ambil 4 karakter terakhir yg merupakan nomor urut dari id_case
                          count = (Number(res[0].id_case.substring(15)) + 1);
                        let result = {
                          prov_city_code: code,
                          dinkes_code: dinkes.dinkes_kota_kode,
                          count_pasien: count
                        }
                      return callback(null, result)
                    }).catch(err => callback(err, null))
              })
}

async function importCases (raw_payload, author, pre, callback) {

  const dataSheet = pre

  let savedCases = null //[]

  let promise = Promise.resolve()

  const refHospitals = await Hospital.find()
  
  for (i in dataSheet) {
    
    let item = dataSheet[i]

    promise = promise.then(async () => {

      const code = item.address_district_code
      const dinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
      const verifStatus = author.role === 'faskes' ? ['pending', 'declined'] : ['verified']
      const districtCases = await Case.find({ address_district_code: code, verified_status: { $in: verifStatus } }).sort({id_case: -1})

      let count = 1
      let casePayload = {}

      if (districtCases.length > 0) {
        const startNum = author.role === 'faskes' ? 15 : 12
        count = (Number(districtCases[0].id_case.substring(startNum)) + 1)
      }

      let district = {
        prov_city_code: code,
        dinkes_code: dinkes.dinkes_kota_kode,
        count_pasien: count
      }

      let verified  = {
        verified_status: 'verified'
      }
    
      if (author.role === "faskes") {
        verified.verified_status = 'pending'
      }

      // create case
      let date = new Date().getFullYear().toString()
      const digit = author.role === 'faskes' ? 5 : 4
      let id_case = author.role === 'faskes' ? "precovid-" : "covid-"
      id_case += district.dinkes_code
      id_case += date.substr(2, 2)
      id_case += "0".repeat(digit - district.count_pasien.toString().length)
      id_case += district.count_pasien

      casePayload = Object.assign(item, verified)
      casePayload = Object.assign(item, {id_case})

      casePayload.author_district_code = author.code_district_city
      casePayload.author_district_name = author.name_district_city

      casePayload = new Case(Object.assign(casePayload, {author}))

      let savedCase = await casePayload.save()

      let historyPayload = { case: savedCase._id }

      let hospitalId = null

      if (item && item.current_location_type === 'RS') {
        
        const hospital = refHospitals.find((h) => h.name === item.current_location_address) || null

        hospitalId = hospital && hospital._id ? hospital._id : null

        if (!hospitalId) {
          if (item.other_notes) {
            item.other_notes += ' , Dirawat di ' + item.current_location_address
          } else {
            item.other_notes = 'Dirawat di ' + item.current_location_address
          }
        }
      }

      item.current_hospital_id = hospitalId || null

      if (item.first_symptom_date == "") {
        item.first_symptom_date = Date.now()
      }

      let history = new History(Object.assign(item, historyPayload))

      let savedHistory = await history.save()

      let last_history = { last_history: savedHistory._id }
      savedCase = Object.assign(savedCase, last_history)
      savedCase = await savedCase.save()

      // savedCases.push(savedCase)
  
      return new Promise(resolve => resolve(savedCase))

    }).catch((e) => { throw new Error(e) })
  }

  promise
    .then(() => callback(null, savedCases))
    .catch(err => callback(err, null))
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

async function healthCheck(payload, callback) {
  try {
    let case_no_last_history = await Case.find({ last_history: {"$exists": false}})

    let result = {
      'case_no_last_history' : case_no_last_history,
    }

    return callback(null, result);
  } catch (error) {
    return callback(error, null)
  }
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
    name: 'services.cases.getByNik',
    method: getCaseByNik
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
    name: 'services.cases.getCountPendingByDistrict',
    method: getCountPendingByDistrict
  },
  {
    name: 'services.cases.softDeleteCase',
    method: softDeleteCase
  },
  {
    name: 'services.cases.listCaseExport',
    method: listCaseExport
  },
  {
    name: 'services.cases.ImportCases',
    method: importCases
  },
  {
    name: 'services.cases.getIdCase',
    method: getIdCase
  },
  {
    name: 'services.cases.healthcheck',
    method: healthCheck,
  },
];

