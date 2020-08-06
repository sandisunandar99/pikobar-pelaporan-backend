const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/CaseVerification');
const CaseVerification = mongoose.model('CaseVerification');

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')

require('../models/User')
const User = mongoose.model('User')

require('../models/Notification')
const Notification = mongoose.model('Notification')

const Notif = require('../helpers/notification')

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

    let updatePayload = {
      verified_comment: payload.verified_comment,
      verified_status: payload.verified_status
    }

    let date = moment(new Date()).format("YY");
    let id_case
    let covid = "covid-"
    let pendingCount = '';
    let pad = "";
    let dinkesCode = pre.count_case.dinkes_code;

    // generate new verified id_case
    if (payload.verified_status === 'verified') {
      pendingCount = pre.count_case.count_pasien;
      pad = pendingCount.toString().padStart(7, "0")
      id_case = `${covid}${dinkesCode}${date}${pad}`;
      updatePayload.id_case = id_case
    }

    // update case verifed status
    const case_ = await Case.findOneAndUpdate({ _id: id}, {
      $set: updatePayload
    }, { new: true })

    // insert verification logs
    payload.verifier = author._id
    payload.case = case_._id

    let item = new CaseVerification(payload)

    const caseVerification = await item.save()

    await Notif.send(Notification, User, case_, author, `case-verification-${payload.verified_status}`) 
    
    return callback(null, caseVerification)
  } catch (error) {
    return callback(null, error)
  }
}

async function createCasesVerification (callback) {
  const start = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))

  const unverifiedCasesFor24Hours = await Case.find({
    verified_status: 'pending',
    delete_status: { $ne: 'deleted' },
    updatedAt: { $lt: start }
  })

  let promise = Promise.resolve()

  for (i in unverifiedCasesFor24Hours) {
    let item = unverifiedCasesFor24Hours[i]
    promise = promise.then(async () => {
      const id = item._id
      const code = item.address_district_code
      const dinkes = await DistrictCity.findOne({ kemendagri_kabupaten_kode: code})

      let payload = {
        verified_status: 'verified',
        verified_comment: 'Automatically verified by the system'
      }
      
      if (item.id_case.substr(0,3) === 'pre') {
        const districtCases = await Case.findOne({
          address_district_code: code, verified_status: 'verified'
        }).sort({id_case: -1})

        let count = 1
        if (districtCases) {
          count = (Number(districtCases.id_case.substring(12)) + 1)
        }

        let district = {
          prov_city_code: code,
          dinkes_code: dinkes.dinkes_kota_kode,
          count_pasien: count
        }

        let date = moment(new Date()).format("YY");
        let id_case
        let covid = "covid-"
        let pendingCount = '';
        let pad = "";
        let dinkesCode = district.dinkes_code;

        pendingCount = district.count_pasien;
        pad = pendingCount.toString().padStart(7, "0")
        id_case = `${covid}${dinkesCode}${date}${pad}`;
        payload.id_case = id_case
      }
      
      const verify = await Case.findOneAndUpdate({ _id: id}, {
        $set: payload
      }, { new: true })

      // insert verification logs
      let verificationPayload = {
        case: id,
        verified_status: 'verified',
        verified_comment: 'Automatically verified by the system',
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

