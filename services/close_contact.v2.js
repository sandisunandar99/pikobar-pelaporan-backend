
const Case = require('../models/Case')
const History = require('../models/History')
const { rollback } = require('../helpers/custom')
const { ROLE, CRITERIA } = require('../helpers/constant')
const Validate = require('../helpers/cases/revamp/handlerpost')
const {
  appendParent,
  premierContactPayload,
} = require('../helpers/closecontact/handler')

async function getByCase (pre, callback) {
  try {

    const match = {
      $match: {
        status: CRITERIA.CLOSE,
        delete_status: { $ne: 'deleted' },
        close_contact_premier: {
          $elemMatch: {
            close_contact_id_case: pre.id_case
          }
        },
      }
    }

    const lookupAuthor = {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    }

    const project = {
      $project: {
        _id: 1,
        id_case: 1,
        name: 1,
        nik: 1,
        phone_number: 1,
        age: 1,
        gender: 1,
        status: 1,
        address_district_name: 1,
        createdAt: 1,
        updatedAt: 1,
        author: {
          _id: 1,
          username: 1,
          fullname: 1,
          code_district_city: 1,
          name_district_city: 1,
        },
      }
    }

    const aggCaseQuery = [
      match,
      lookupAuthor,
      project,
    ]

    const results = await Case.aggregate(aggCaseQuery)

    return callback(null, results)
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
      rollback(Case, insertedIds)
      return callback(e, null)
    }
  }

  return callback(null, res)
}

async function pullCaseContact (parent, contactCaseId, callback) {
  try {
    const result = await Case.findByIdAndUpdate(contactCaseId, {
      $pull: {
        close_contact_premier: {
          close_contact_id_case: parent.id_case
        }
      }
    })
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
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
  {
    name: 'services.closeContacts.v2.pullCaseContact',
    method: pullCaseContact
  },
]
