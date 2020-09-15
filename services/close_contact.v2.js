
const Case = require('../models/Case')
const History = require('../models/History')
const { rollback } = require('../helpers/custom')
const { ROLE, CRITERIA } = require('../helpers/constant')
const Validate = require('../helpers/cases/revamp/handlerpost')
const {
  appendParent,
  premierContactPayload,
} = require('../helpers/closecontact/handler')

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

const create = async (services, pre, author, payload, callback) => {
  const res = []
  const insertedIds = []
  const cases = pre.cases

  for (i in payload) {
    try {
      const req = payload[i]
      let foundedCase = null

      if (req.id_case || req.nik) {
        foundedCase = await appendParent(Case, req, cases)
      }

      if (!foundedCase) {
        const pre = {
          count_case: {},
          count_case_pending: {},
        }

        await services.cases.getCountByDistrict(
          req.address_district_code,
          (err, count) => {
            if (err) throw new Error
            pre.count_case = count
          })

        const idCase = Validate.generateIdCase({
          role: ROLE.KOTAKAB
        }, pre)

        const insertedCase = await Case.create({
          id_case: idCase,
          author: author._id,
          final_result: '5',
          is_reported: false,
          verified_status: 'verified',
          status: CRITERIA.CLOSE,
          origin_closecontact: true,
          ...premierContactPayload(cases),
          ...req,
        })

        const insertedHis = await History.create({
          case: insertedCase._id,
          status: CRITERIA.CLOSE,
          final_result: '5',
          current_location_type: 'RUMAH',
        })

        await Case.findOneAndUpdate(
          { _id: insertedCase._id },
          { $set: { last_history: insertedHis._id } },
          { upsert: true, new: true }
        )

        res.push(insertedCase)
        insertedIds.push(insertedCase)
      } else {
        res.push(foundedCase)
      }
    } catch (e) {
      await rollback(Case, insertedIds)
      return callback(err, null)
    }
  }

  return callback(null, res)

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
