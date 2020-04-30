const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/CaseVerification');
const CaseVerification = mongoose.model('CaseVerification');

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')


var schedule = require('node-schedule');
// running task every 1 hours
schedule.scheduleJob('*/59 * * * *', function(){
  createCasesVerification((err, result) => {
    if (err) return 'auto verification error'
    return 'auto verification succeed'
  })
});

async function getCaseVerifications (caseId, callback) {
  try {

    let verifications = await CaseVerification
      .find({ case: caseId })
      .populate('verifier')
      .sort({ createdAt: 'desc'})

    verifications = verifications.map(verifications => verifications.toJSONFor())
    
    return callback(null, verifications)
  } catch (error) {
    return callback(null, error)
  }
}

async function createCaseVerification (id, author, pre, payload, callback) {
  try {

    // generate new verified id_case
    let date = new Date().getFullYear().toString()
    let id_case = "covid-"
    id_case += pre.dinkes_code
    id_case += date.substr(2, 2)
    id_case += "0".repeat(4 - pre.count_pasien.toString().length)
    id_case += pre.count_pasien

    // update case verifed status
    const case_ = await Case.findOneAndUpdate({ _id: id}, {
      $set: {
        id_case: id_case,
        verified_status: payload.verified_status
      }
    }, { new: true })

    // insert verification logs
    payload.case = case_
    payload.verifier = author

    let item = new CaseVerification(payload)

    const caseVerification = await item.save()
    
    return callback(null, caseVerification)
  } catch (error) {
    return callback(null, error)
  }
}

async function createCasesVerification (callback) {
  const start = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))

  const verified = await Case.find({
    verified_status: 'pending',
    createdAt: { $lt: start }
  })

  let promise = Promise.resolve()

  for (i in verified) {
    let item = verified[i]
    promise = promise.then(async () => {
      const id = item._id
      const code = item.address_district_code
      const dinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code})

      let payload = {
        verified_status: 'verified'
      }
      
      if (item.id_case.substr(0,3) === 'pre') {
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

      // insert verification logs
      let verificationPayload = {
        case: id,
        verified_status: 'verified',
        note: 'Automatically verified by the system',
        verifier: null
      }

      let verification = new CaseVerification(verificationPayload)

      await verification.save()

      return new Promise(resolve => resolve())
    })
  }

  promise
  .then(() => callback(null, null))
  .catch(err => callback(err, null))
}

module.exports = [
  {
    name: 'services.casesVerifications.get',
    method: getCaseVerifications
  },
  {
    name: 'services.casesVerifications.create',
    method: createCaseVerification
  },
  {
    name: 'services.casesVerifications.createCasesVerification',
    method: createCasesVerification,
  }
];

