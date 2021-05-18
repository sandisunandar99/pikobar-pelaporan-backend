const Case = require('../models/Case');
const History = require('../models/History')
const User = require('../models/User')
const DistrictCity = require('../models/DistrictCity')
const Check = require('../helpers/rolecheck')
const { notify } = require('../helpers/notification')
const Filter = require('../helpers/filter/casefilter')
const CloseContact = require('../models/CloseContact')
const { doUpdateEmbeddedClosecontactDoc } = require('../helpers/cases/setters')
const { CRITERIA, WHERE_GLOBAL, ROLE } = require('../helpers/constant')
const { summaryCondition } = require('../helpers/cases/global')
const moment = require('moment')
const { clientConfig } = require('../config/redis')
const { resultJson, optionsLabel } = require('../helpers/paginate')
const { thisUnitCaseAuthors } = require('../helpers/cases/global')
const { searchFilter } = require('../helpers/filter/search')

const queryList = async (query, user, options, params, caseAuthors, callback) => {
  if(query.search){
    let search_params = searchFilter(query.search, ['id_case','name','nik','phone_number'])
    if (query.verified_status !== 'verified') {
      let users = await User.find({username: new RegExp(query.search,"i"), code_district_city: user.code_district_city}).select('_id')
      search_params.push({ author: { $in: users.map(obj => obj._id) } })
    }
    var result_search = Check.listByRole(user, params, search_params,Case, "delete_status", caseAuthors)
  } else {
    var result_search = Check.listByRole(user, params, null,Case, "delete_status", caseAuthors)
  }

  Case.paginate(result_search, options).then(function(results){
    let res = resultJson('cases', results)
    return callback(null, res)
  }).catch(err => callback(err, null))
}

const sortCase = (query) => {
  // let sort = { last_date_status_patient: 'desc', updatedAt: 'desc' };
  // kembali ke awal

  let sort = { updatedAt: 'desc' };
  if (query.sort && query.sort.split) {
    let splits = query.sort.split(':')
    sort.last_date_status_patient = splits[1];
    sort[splits[0]] = splits[1];
  }

  return sort
}

async function listCase (query, user, callback) {
  // kembali ke awal let sort = { last_date_status_patient: 'desc', updatedAt: 'desc' };
  const sort = sortCase(query)
  const populate = (['last_history', 'author'])
  const options = optionsLabel(query, sort, populate)
  let params = await Filter.filterCase(user, query)
  // only provide when needed
  if(query.start_date && query.end_date){
    params.createdAt = {
      "$gte": new Date(new Date(query.start_date)).setHours(00, 00, 00),
      "$lt": new Date(new Date(query.end_date)).setHours(23, 59, 59)
    }
  }
  params.last_history = { $exists: true, $ne: null }
  params.is_west_java = { $ne: false }
  if ([true, false].includes(query.is_west_java)) params.is_west_java = query.is_west_java
  // temporarily for fecth all case to all authors in same unit, shouldly use aggregate
  let caseAuthors = await thisUnitCaseAuthors(user, { unit_id: user.unit_id._id })
  if (user.role === ROLE.FASKES && user.unit_id) delete params.author
  await queryList(query, user, options, params, caseAuthors, callback)
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
  if(query.status){
    params.status = query.status;
  }
  if(query.address_district_code){
    params.address_district_code = query.address_district_code;
  }
  Case.find(params).select('id_case name')
  .where('delete_status').ne('deleted').limit(100)
  .then(cases => callback (null, cases.map(cases => cases.JSONFormIdCase())))
  .catch(err => callback(err, null));
}

async function getCaseSummary(query, user, callback) {
  const condition = { unit_id: user.unit_id._id, role: ROLE.FASKES }
  try {
    clientConfig.get(`summary-cases-list-${user.username}`, async (err, result) => {
      const caseAuthors = await thisUnitCaseAuthors(user, condition)
      const scope = Check.countByRole(user, caseAuthors)
      const filter = await Filter.filterCase(user, query)
      const searching = Object.assign(scope, filter)
      const { sumFuncNoMatch } = require('../helpers/aggregate/func')
      if(result){
        const resultJSON = JSON.parse(result)
        callback(null, resultJSON)
      }else{
        const conditions = [
          { $match: {
            $and: [  searching, { ...WHERE_GLOBAL, last_history: { $exists: true, $ne: null } } ]
          }},
          {
            $group: {
              _id: 'status',
              confirmed: sumFuncNoMatch([{ $eq: ['$status', CRITERIA.CONF] }]),
              probable: sumFuncNoMatch([{ $eq: ['$status', CRITERIA.PROB] }]),
              suspect: sumFuncNoMatch([{ $eq: ['$status', CRITERIA.SUS] }]),
              closeContact: sumFuncNoMatch([{ $eq: ['$status', CRITERIA.CLOSE] }]),
            },
          },{ $project: { _id : 0 } },
        ]
        const result = await Case.aggregate(conditions)
        const shiftResult = result.shift()
        clientConfig.setex(`summary-cases-list-${user.username}`, 15 * 60 * 1000, JSON.stringify(shiftResult)) // set redis key
        callback(null, shiftResult)
      }
    })
  } catch (e) {
    callback(e, null)
  }
}

async function getCaseSummaryVerification (query, user, callback) {
  // Temporary calculation method for faskes as long as the user unit has not been mapped, todo: using lookup
  const condition = { unit_id: user.unit_id._id, role: ROLE.FASKES }
  const caseAuthors = await thisUnitCaseAuthors(user, condition)
  const searchByRole = Check.countByRole(user,caseAuthors);
  const filterSearch = await Filter.filterCase(user, query)
  const searching = {...searchByRole, ...filterSearch}
  var aggStatus = [{ $match: {
      $and: [  searching, { delete_status: { $ne: 'deleted' } } ]
    }},
    { $group: { _id: "$verified_status", total: { $sum: 1 }} }
  ];

  let result =  { 'PENDING': 0, 'DECLINED': 0, 'VERIFIED': 0 }
  Case.aggregate(aggStatus).exec().then(async item => {
      item.forEach(function(item){
        summaryCondition(item, 'pending', result, 'PENDING')
        summaryCondition(item, 'declined', result, 'DECLINED')
        summaryCondition(item, 'verified', result, 'VERIFIED')
      })
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

  let date = moment(new Date()).format("YY");
  let id_case
  let preCovid = "precovid-"
  let covid = "covid-"
  let pendingCount = '';
  let pad = "";
  let dinkesCodeFaskes = pre.count_case_pending.dinkes_code;
  let dinkesCode = pre.count_case.dinkes_code;

  if (author.role === 'faskes') {
    pendingCount = pre.count_case_pending.count_pasien;
    pad = pendingCount.toString().padStart(5, "0")
    id_case = `${preCovid}${dinkesCodeFaskes}${date}${pad}`;
  } else {
    pendingCount = pre.count_case.count_pasien;
    pad = pendingCount.toString().padStart(7, "0")
    id_case = `${covid}${dinkesCode}${date}${pad}`;
  }

  let insert_id_case = Object.assign(raw_payload, verified) //TODO: check is verified is not overwritten ?

  if (!insert_id_case.hasOwnProperty('id_case') || [null, ""].includes(insert_id_case['id_case']) ) {
      insert_id_case = Object.assign(raw_payload, {id_case})
  }

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
      x.save().then(async final =>{ // step 3: udpate last_history di case ambil object ID nya hitory

        notify('CaseCreated', x, author)
        return callback(null, final)
      })
    })
   }).catch(err => callback(err, null))
}

async function updateCase (id, pre, author, payload, callback) {

  /* can't update id_case & verified props from here */
  delete payload.id_case
  delete payload.verified_status
  delete payload.verified_comment

  payload.author_district_code = author.code_district_city
  payload.author_district_name = author.name_district_city

  // Regenerate id_case if district code address is changed.
  if (payload.address_district_code && (payload.address_district_code !== pre.cases.address_district_code)) {
    let date = moment(new Date()).format("YY");
    let id_case
    let preCovid = "precovid-"
    let covid = "covid-"
    let pendingCount = '';
    let pad = "";
    let dinkesCodeFaskes = pre.count_case_pending.dinkes_code;
    let dinkesCode = pre.count_case.dinkes_code;

    if (pre.cases.verified_status !== 'verified') {
      pendingCount = pre.count_case_pending.count_pasien;
      pad = pendingCount.toString().padStart(5, "0")
      id_case = `${preCovid}${dinkesCodeFaskes}${date}${pad}`;
    } else {
      pendingCount = pre.count_case.count_pasien;
      pad = pendingCount.toString().padStart(7, "0")
      id_case = `${covid}${dinkesCode}${date}${pad}`;
    }

    payload.id_case = id_case
    await doUpdateEmbeddedClosecontactDoc(pre.cases.id_case, id_case, Case)
  }

  const options = { new: true }
  if (pre.cases.verified_status !== 'verified') options.timestamps = false

  Case.findOneAndUpdate({ _id: id}, { $set: payload }, options)
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

async function getCountByDistrict(code, callback) {
  /* Get last number of current district id case order */
  try {
    const params = {
      address_district_code: code,
      verified_status: 'verified'
    }
    const dinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code});
    const res = await Case.find(params).sort({id_case: -1}).limit(1);
    let count = 1;
    // find array data is not null
    if (res.length > 0){
      count = (Number(res[0].id_case.substring(12)) + 1);
    }
    let result = {
      prov_city_code: code,
      dinkes_code: dinkes.dinkes_kota_kode,
      count_pasien: count
    }
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
}

async function getCountPendingByDistrict(code, callback) {
  /* Get last number of current district id case order */
  const {
    DRAFT, PENDING, DECLINED
  } = require('../helpers/constant')['VERIFIED_STATUS']

  try {
    const params = {
      address_district_code: code,
      verified_status: { $in: [ DRAFT, PENDING, DECLINED ] },
    }
    const dinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code});
    const res = await Case.find(params).sort({id_case: -1}).limit(1);
    let count = 1;
    // find array data is not null
    if (res.length > 0){
      count = (Number(res[0].id_case.substring(15)) + 1);
    }
    let result = {
      prov_city_code: code,
      dinkes_code: dinkes.dinkes_kota_kode,
      count_pasien: count
    }
    callback(null, result);
  } catch (error) {
    callback(error, null);
  }
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
    .or({ last_history:null })
    let result = {
      'case_no_last_history' : case_no_last_history,
    }
    return callback(null, result);
  } catch (error) {
    return callback(error, null)
  }
}

async function epidemiologicalInvestigationForm (detailCase, callback) {
  const pdfmaker = require('../helpers/pdfmaker')
  const histories = await History.find({ case: detailCase._id })
  const closeContacts = await CloseContact.find({ case: detailCase._id, delete_status: { $ne: 'deleted' } })
  Object.assign(detailCase, { histories: histories, closeContacts: closeContacts })
  return callback(null, pdfmaker.epidemiologicalInvestigationsForm(detailCase))
}

module.exports = [
  {
    name: 'services.cases.list',
    method: listCase
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
    name: 'services.cases.getSummaryVerification',
    method: getCaseSummaryVerification
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
    name: 'services.cases.getIdCase',
    method: getIdCase
  },
  {
    name: 'services.cases.healthcheck',
    method: healthCheck,
  },
  {
    name: 'services.cases.epidemiologicalInvestigationForm',
    method: epidemiologicalInvestigationForm
  }
];

