const mongoose = require('mongoose');

require('../models/Rdt');
const Rdt = mongoose.model('Rdt');

require('../models/Case')
const Case = mongoose.model('Case');


require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')

const https = require('https')

function listPerRole(user,params,search_params){
  var result_search = ''
  if(search_params == null){
    if (user.role == 'dinkeskota') {
      result_search = Rdt.find(params).where('status').ne('deleted')
    } else if (user.role == 'dinkesprov' || user.role == 'superadmin') {
      result_search = Rdt.find().where('status').ne('deleted')
    } else {
      result_search = Rdt.find({
        'author': user._id
      }).where('status').ne('deleted')
    }
  }else{
    if (user.role == 'dinkeskota') {
      var result_search = Rdt.find(params).or(search_params).where('status').ne('deleted')
    } else if (user.role == 'dinkesprov' || user.role == 'superadmin') {
      var result_search = Rdt.find().or(search_params).where('status').ne('deleted')
    } else {
      var result_search = Rdt.find({
        'author': user._id
      }).or(search_params).where('status').ne('deleted')
    }
  }
  return result_search
}

function ListRdt (query, user, callback) {

  const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    meta: '_meta'
  };

  if(query.sort == 'desc'){
    var sorts = {_id:"desc"}
  }else{
    var sorts = JSON.parse(query.sort)
  }
  const options = {
    page: query.page,
    limit: query.limit,
    populate: ( 'author'),
    address_district_code: query.address_district_code,
    sort: sorts,
    leanWithId: true,
    customLabels: myCustomLabels
  };


  

  var params = new Object();

  if (query.address_district_code) {
    params.address_district_code = query.address_district_code;
    params.author = user._id;
  }

  if (query.search) {
    var search_params = [
      { code_test: new RegExp(query.search, "i") },
      { name: new RegExp(query.search, "i") },
      { final_result: new RegExp(query.search, "i") },
      { category: new RegExp(query.search, "i") },
      { phone_number: new RegExp(query.search, "i") },
    ];

    var result_search = listPerRole(user,params,search_params)
  } else {
    var result_search = listPerRole(user,params,null)
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

function GetRdtSummaryByCities (query, callback) {
  var aggStatus = [
    { $match: { tool_tester: 'RAPID TEST'} },
    {$group: {
      _id: "$test_address_district_code",
      total: {$sum: 1}
    }}
  ];

  Rdt.aggregate(aggStatus).exec().then(item => {
      return callback(null, item)
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

  let id_case
  if (payload.final_result === "POSITIF") {
          id_case = "COVID-"
          id_case += pre.count_case.dinkes_code
          id_case += date.substr(2, 2)
          id_case += "0".repeat(4 - pre.count_case.count_pasien.toString().length)
          id_case += pre.count_case.count_pasien
  }

  let code = {
    code_test: code_test,
    code_tool_tester: code_tool_tester,
    id_case: id_case
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
                          count = (Number(res[0].id_case.substring(12)));
                        let result = {
                          prov_city_code: code,
                          dinkes_code: dinkes.dinkes_kota_kode,
                          count_pasien: count
                        }
                      return callback(null, result)
                    }).catch(err => callback(err, null))
              })
}


function softDeleteRdt(rdt, cases,  deletedBy, callback) {
    let date = new Date()
    let dates = {
        status: 'deleted',
        deletedAt: date.toISOString()
    }

    let dates_case = {
      delete_status: 'deleted',
      deletedAt: date.toISOString()
    }

    let param_case = Object.assign({deletedBy}, dates_case)
    cases = Object.assign(cases, param_case)
    cases.save((err, item) => {
      if (err) return callback(err, null)
    })
    

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


function getCaseByidcase(idcase,callback) {

  let param = {
    id_case: idcase,
    is_test_masif: true
  }

  Case.findOne(param)
      .exec()
      .then(cases => {
          return callback(null, cases)
      })
      .catch(err => callback(err, null))

}

function FormSelectIdCase(query, user, data_pendaftaran, callback) {
  
  var params = new Object();

  if (query.address_district_code) {
    params.address_district_code = query.address_district_code;
    params.author = user._id;
  }

  Case.find(params)
    .and({
      status: 'ODP'
    })
    .where('delete_status')
    .ne('deleted')
    .exec()
    .then(x => {
      
      let res = x.map(res => res.JSONFormCase())
      let concat = res.concat(data_pendaftaran)
      return callback(null, concat)

    })
    .catch(err => callback(err, null))
}

function getDatafromExternal(address_district_code, callback) {

   https.get('https://covid19-executive.digitalservice.id/api/v1/pelaporan/pendaftaran_rdt?api_key=4n8534p9nckfdsgkj&keyword=mas&address_district_code=' + address_district_code, (res) => {
     let data = '';
     // A chunk of data has been recieved.
     res.on('data', (chunk) => {
       data += chunk;
     });


     res.on('end', () => {
       let jsonData = JSON.parse(data)
       let outputData = []
       jsonData.forEach(val => {
         outputData.push({
           display: val.name + "/" + val.nik + "/" + val.phone_number,
           id_case: null,
           id: null
         })
       });
       return callback(null, outputData)
     });

   }).on("error", (err) => {
     console.log("Error: " + err.message);
   });
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
    name: 'services.rdt.GetRdtSummaryByCities',
    method: GetRdtSummaryByCities
  },
  {
    name: 'services.rdt.getCodeDinkes',
    method: getCodeDinkes
  },
  {
    name: 'services.rdt.getCountByDistrict',
    method: getCountByDistrict
  },
  {
    name: 'services.rdt.getCaseByidcase',
    method: getCaseByidcase
  },
  {
    name: 'services.rdt.FormSelectIdCase',
    method: FormSelectIdCase
  },
  {
    name: 'services.rdt.getDatafromExternal',
    method: getDatafromExternal
  }
];

