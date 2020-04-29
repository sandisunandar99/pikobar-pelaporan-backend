const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/CaseApproval');
const CaseApproval = mongoose.model('CaseApproval');

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')


var schedule = require('node-schedule');
// running task every 1 hours
schedule.scheduleJob('*/59 * * * *', function(){
  createCasesAproval((err, result) => {
    if (err) return 'auto approval error'
    return 'auto approval succeed'
  })
});

async function getCaseAprovals (caseId, callback) {
  try {

    let approvals = await CaseApproval
      .find({ case: caseId })
      .populate('verifier')
      .sort({ createdAt: 'desc'})

    approvals = approvals.map(approvals => approvals.toJSONFor())
    
    return callback(null, approvals)
  } catch (error) {
    return callback(null, error)
  }
}

async function createCaseAproval (id, author, pre, payload, callback) {
  try {

    // update case verifed status
    const case_ = await Case.findOneAndUpdate({ _id: id}, {
      $set: {
        verified_status: payload.verified_status
      }
    }, { new: true })
    
    // insert approval logs
    payload.case = case_._id
    payload.verifier = author

    let item = new CaseApproval(payload)
    console.log(item)
    const casesApproval = await item.save()
    
    return callback(null, casesApproval)
  } catch (error) {
    return callback(null, error)
  }
}

async function createCasesAproval (callback) {
  const start = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))

  const approved = await Case.find({
    verified_status: 'pending',
    createdAt: { $lt: start }
  })

  let promise = Promise.resolve()

  for (i in approved) {
    let item = approved[i]
    promise = promise.then(async () => {
      const id = item._id
      const code = item.address_district_code
      const dinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code})

      let payload = {
        verified_status: 'verified'
      }
      
      if (!item.id_case) {
        const districtCases = await Case.find({
          address_district_code: code, verified_status: 'verified'
        }).sort({id_case: -1})

        let count = 1
        if (districtCases.length > 0) {
          count = (Number(districtCases[0].id_case.substring(12)) + 1)
        }

        let district = {
          prov_city_code: code,
          dinkes_code: dinkes.dinkes_kota_kode,
          count_pasien: count
        }

        let date = new Date().getFullYear().toString()
        let id_case = "covid-"
        id_case += district.dinkes_code
        id_case += date.substr(2, 2)
        id_case += "0".repeat(4 - district.count_pasien.toString().length)
        id_case += district.count_pasien
        payload.id_case = id_case
      }
      
      const verify = await Case.findOneAndUpdate({ _id: id}, {
        $set: payload
      }, { new: true })

      return new Promise(resolve => resolve())
    })
  }

  promise
  .then(() => callback(null, null))
  .catch(err => callback(err, null))
}

module.exports = [
  {
    name: 'services.casesApprovals.get',
    method: getCaseAprovals
  },
  {
    name: 'services.casesApprovals.create',
    method: createCaseAproval
  },
  {
    name: 'services.casesApprovals.createCasesAproval',
    method: createCasesAproval,
  }
];

