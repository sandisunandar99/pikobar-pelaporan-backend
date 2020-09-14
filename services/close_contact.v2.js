
const Case = require('../models/Case')
const History = require('../models/History')
const ObjectId = require("mongoose").Types.ObjectId
const { CRITERIA, ROLE } = require('../helpers/constant')
const DistrictCity = require('../models/DistrictCity')
const Validate = require('../helpers/cases/revamp/handlerpost')

// scope helper
const appendParent = async (req, caseId) => {
  const rules = req.nik
    ? { nik: req.nik }
    : { phone_number: req.phone_number }

  return await Case.findOneAndUpdate(rules, {
    $addToSet: { parents: caseId }
  })
}

// scope helper
const prePerCreate = async (disctricCode) => {
  const dinkes = await DistrictCity.findOne({
    kemendagri_kabupaten_kode: disctricCode,
  })

  const districtCases = await Case.findOne({
    address_district_code: disctricCode,
    verified_status: 'verified'
  }).sort({id_case: -1})

  return {
    count_case: {
      prov_city_code: disctricCode,
      dinkes_code: dinkes.dinkes_kota_kode,
      count_pasien: districtCases ? (Number(districtCases.id_case.substring(12)) + 1) : 1
    },
    count_case_pending: {}
  }
}

// get all case bases on parent case
async function getByCase (caseId, callback) {
  try {
    const results = await Case.find({
      status: CRITERIA.CLOSE,
      parents: { $elemMatch: { $eq: new  ObjectId(caseId) } },
      delete_status: { $ne: 'deleted' }
    }).populate(['author'])

    return callback(null, results.map(res => res.toJSONFor()))
  } catch (e) {
    return callback(e, null)
  }
}

// annoying multiple closecontacts report based on ui
const create = async (caseId, author, payload, callback) => {
  const insertedIds = []

  /**
   * Why using promise inside async await?
   * to isolated all process inside iteration
   * prevent to to execute next iteration
   */
  let promise = Promise.resolve()

  for (i in payload) {
    const req = payload[i]

    promise = promise.then(async () => {
      let foundedCase = null
      if (req.nik || req.phone_number) {
        foundedCase = await appendParent(req, caseId)
      }

      if (!foundedCase) {

          const pre = await prePerCreate(req.address_district_code)

          const idCase = Validate.generateIdCase({ role: ROLE.KOTAKAB }, pre)

          const c = await Case.create({
            id_case: idCase,
            author: author._id,
            final_result: '5',
            is_reported: false,
            verified_status: 'verified',
            origin_closecontact: true,
            ...req,
          })

          const h = await History.create({
            case: c._id,
            status: CRITERIA.CLOSE,
            final_result: '5',
            current_location_type: 'RUMAH',
          })

          await Case.findOneAndUpdate(
            { _id: c._id },
            { $set: { last_history: h._id } },
            { upsert: true, new: true }
          )

          insertedIds.push(c)
      }
      return new Promise(resolve => resolve())
    })
  }

  promise
    .then(() => callback(null, insertedIds))
    .catch(async err => {
      const cases = insertedIds.map(c => c._id)
      await Case.deleteMany({
        _id: { $in: cases }
      })
      callback(err, null)
    })
}

module.exports = [
  {
    name: 'services.closeContacts.v2.getByCase',
    method: getByCase
  },
  {
    name: 'services.closeContacts.v2.create',
    method: create
  },
]
