const Case = require('../models/Case')
const User = require('../models/User')
const ObjectId = require('mongodb').ObjectID
const { ROLE } = require('../helpers/constant')
const Notif = require('../helpers/notification')
const Notification = require('../models/Notification')
const CaseVerification = require('../models/CaseVerification')
const Validate = require('../helpers/cases/revamp/handlerpost')
const { getCountBasedOnDistrict } = require('../helpers/cases/global')

async function getCaseVerifications (caseId, callback) {
  try {

    let verifications = await CaseVerification
      .find({ case: caseId })
      .populate('verifier')
      .sort({ createdAt: 'desc'})

    verifications = verifications.map(verifications => verifications.toJSONFor())

    callback(null, verifications)
  } catch (error) {
    callback(error, null)
  }
}

async function createCaseVerification (id, author, pre, payload, callback) {
  try {
    const updatePayload = {
      verified_comment: payload.verified_comment,
      verified_status: payload.verified_status
    }

    // generate new verified id_case
    if (payload.verified_status === 'verified') {
      updatePayload.id_case = Validate.generateIdCase(author, {
        count_case: {},
        count_case_pending: pre
      }, payload)
    }

    // update case verifed status
    const case_ = await Case.findOneAndUpdate(
      { _id: id},
      { $set: updatePayload},
      { new: true }
    )

    // insert verification logs
    payload.verifier = author._id
    payload.case = case_._id

    const item = new CaseVerification(payload)

    const caseVerification = await item.save()

    await Notif.send(Notification, User, case_, author, `case-verification-${payload.verified_status}`)

    callback(null, caseVerification)
  } catch (error) {
    callback(error, null)
  }
}

async function createCasesVerification (services, callback) {
  const start = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))

  const unverifiedCasesFor24Hours = await Case.find({
    verified_status: 'pending',
    delete_status: { $ne: 'deleted' },
    updatedAt: { $lt: start }
  })

  try {
    for (i in unverifiedCasesFor24Hours) {
      let item = unverifiedCasesFor24Hours[i]
      const id = item._id

      const payload = {
        verified_status: 'verified',
        verified_comment: 'Automatically verified by the system'
      }

      if (item.id_case.substr(0,3) === 'pre') {
        // get requirement doc to generate id case
        const pre = await getCountBasedOnDistrict(services, item.address_district_code)
        const idCase = Validate.generateIdCase({role: ROLE.KOTAKAB}, pre, item)
        payload.id_case = idCase
      }

      await Case.updateOne({ _id: ObjectId(id) }, {
        $set: payload
      })

      // insert verification logs
      const verificationPayload = {
        case: id,
        verified_status: 'verified',
        verified_comment: 'Automatically verified by the system',
        verifier: null
      }

      const verification = new CaseVerification(verificationPayload)

      await verification.save()
    }
    callback(null, true)
  } catch (error) {
    callback(error, null)
  }

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
