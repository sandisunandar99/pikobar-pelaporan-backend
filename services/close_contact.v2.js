
const Case = require('../models/Case')
const ObjectId = require('mongodb').ObjectID
const { rollback } = require('../helpers/custom')
const { CRITERIA } = require('../helpers/constant')
const {
  appendParent,
  premierContactPayload,
} = require('../helpers/closecontact/handler')

async function aggCase (idCase, rules) {
  const match = rules

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
    }
  }

  const aggCaseQuery = [
    match,
    project,
  ]

  const results = await Case.aggregate(aggCaseQuery)

  return results
}

async function getByCase (pre, callback) {
  try {
    const {
      id_case,
      close_contact_premier,
    } = pre

    const rules = {
      parent: {
        $match: {
          id_case: {
            $in: close_contact_premier
              .map(v => v.close_contact_id_case)
          },
          delete_status: { $ne: 'deleted' },
        },
      },
      child: {
        $match: {
          close_contact_premier: {
            $elemMatch: {
              close_contact_id_case: pre.id_case,
            },
          },
          delete_status: { $ne: 'deleted' },
        },
      },
    }

    const parentCases = await aggCase(id_case, rules.parent)
    const childCases = await aggCase(id_case, rules.child)
    const related_cases = [
      ...parentCases,
      ...childCases,
    ]

    callback(null, related_cases)
  } catch (e) {
    console.log(e)
    callback(e, null)
  }

}

const create = async (services, pre, author, payload, callback) => {
  const result = []
  const insertedIds = []
  const cases = pre.cases

  // if curent case criteria is closecontact just appending parent to this casse
  if (cases.status === CRITERIA.CLOSE) {
    try {
      const params = { id_case: cases.id_case }
      const parentContacts = payload.map(obj => premierContactPayload(obj))
      const result = await appendParent(Case, params, parentContacts)
      callback(null, result)
    } catch (e) {
      callback(e, null)
    }
  }

  /**
   * if current case criteria isn't closecontact,
   * do inserting child by appending premier per contact case
   */
  for (i in payload) {
    try {
      let foundedCase, insertedCase;
      const req = payload[i]
      const createCasePayload = {
        final_result: '5',
        is_reported: false,
        verified_status: 'verified',
        status: CRITERIA.CLOSE,
        origin_closecontact: true,
        current_location_type: 'RUMAH',
        close_contact_premier: {
          ...premierContactPayload(cases),
        },
        ...req,
      }

      // append parent if case is founded
      if (req.id_case || req.nik) {
        foundedCase = await appendParent(Case, req, cases)
      }

      if (!foundedCase) {
        // prerequisites per-premierCase to creating new case
        const pre = {
          count_case: {},
          count_case_pending: {},
        }
        await services.cases.getCountByDistrict(
          req.address_district_code,
          (err, res) => {
            if (err) throw new Error
            pre.count_case = res
          })

        await services.cases_revamp.create(
          createCasePayload, author, pre,
          (err, res) => {
            if (err) throw new Error
            insertedCase = res
            result.push(insertedCase)
            insertedIds.push(insertedCase)
          })

      } else {
        res.push(foundedCase)
      }
    } catch (e) {
      rollback(Case, insertedIds)
      callback(e, null)
    }
  }

  callback(null, result)
}

async function pullCaseContact (thisCase, contactCase, callback) {
  try {
    const deleteChild = await Case.updateOne(
      { _id: ObjectId(contactCase._id) },
      {
        $pull: {
          close_contact_premier: {
            close_contact_id_case: thisCase.id_case
          }
        }
      }
    )

    const deleteParent = await Case.updateOne(
      { _id: ObjectId(thisCase._id) },
      {
        $pull: {
          close_contact_premier: {
            close_contact_id_case: contactCase.id_case
          }
        }
      }
    )

    const result = !!(deleteChild && deleteParent)

    callback(null, result)
  } catch (e) {
    callback(e, null)
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
