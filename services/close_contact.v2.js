
const Case = require('../models/Case')
const History = require('../models/History')
const ObjectId = require("mongoose").Types.ObjectId
const { CRITERIA, ROLE } = require('../helpers/constant')
const DistrictCity = require('../models/DistrictCity')
const Validate = require('../helpers/cases/revamp/handlerpost')

// scope helper
const appendParent = async (req, cases) => {
  const rules = req.nik
    ? { nik: req.nik }
    : { phone_number: req.phone_number }

  return await Case.findOneAndUpdate(rules, {
    $addToSet: { close_contact_premier: {
      is_west_java: true,
      close_contact_id_case: cases.id_case,
      close_contact_criteria: cases.status,
      close_contact_name: cases.name,
      close_contact_phone: cases.phone_number,
      close_contact_birth_date: cases.birth_date,
      close_contact_age: cases.age,
      close_contact_gender: cases.gender,
      close_contact_address_street: cases.address_street,
      close_contact_relation: cases.relationship,
      close_contact_activity: cases.activity_other,
      close_contact_first_date: new Date(),
      close_contact_last_date: new Date(),
    } }
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
      close_contact_premier: {
        $elemMatch: {
          close_contact_id_case: caseId
        }
      },
      delete_status: { $ne: 'deleted' }
    }).populate(['author'])

    return callback(null, results.map(res => res.toJSONFor()))
  } catch (e) {
    return callback(e, null)
  }
}

// annoying multiple closecontacts report based on ui
const create = async (caseId, pre, author, payload, callback) => {
  const cases = pre.cases
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
        foundedCase = await appendParent(req, cases)
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
            status: CRITERIA.CLOSE,
            origin_closecontact: true,
            close_contact_premier: {
              is_west_java: true,
              close_contact_id_case: cases.id_case,
              close_contact_criteria: cases.status,
              close_contact_name: cases.name,
              close_contact_phone: cases.phone_number,
              close_contact_birth_date: cases.birth_date,
              close_contact_age: cases.age,
              close_contact_gender: cases.gender,
              close_contact_address_street: cases.address_street,
              close_contact_relation: cases.relationship,
              close_contact_activity: cases.activity_other,
              close_contact_first_date: new Date(),
              close_contact_last_date: new Date(),
            },
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
