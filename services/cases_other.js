const Case = require('../models/Case')
const History = require('../models/History')
const ObjectId = require('mongodb').ObjectID
const { CRITERIA, WHERE_GLOBAL, HISTORY_DEFAULT_SORT, ROLE } = require('../helpers/constant')
const { clientConfig } = require('../config/redis')
const { thisUnitCaseAuthors } = require('../helpers/cases/global')
const { countByRole } = require('../helpers/rolecheck')
const { filterCase } = require('../helpers/filter/casefilter')

const conditional = async (result, payload, val) => {
  if (result.length > 0) {
    result.map(async res => {
      delete res._id;
      res.status = payload.status,
      res.stage = res.stage,
      res.final_result = payload.final_result,
      res.last_date_status_patient = payload.last_date_status_patient,
      res.current_location_type = res.current_location_type
      const getData = await History.create(res)
      await Case.updateOne({'_id': res.case}, {
        $set: { 'last_history': getData._id }}
      )
    })
  } else {
    const bodys = {
      case: val,
      status: payload.status,
      final_result: payload.final_result,
      last_date_status_patient: payload.last_date_status_patient,
      current_location_type: 'OTHERS'
    }
    const getData = await History.create(bodys)
    await Case.updateOne({'_id': ObjectId(val)}, { $set: { 'last_history': getData._id }})
  }
}

const multipleUpdate = async (payload, user, callback) => {
  try {
    const getId = payload.id_case
    delete payload.id_case
    const maping = getId.map(r => { return ObjectId(r) })
    const updated = await Case.updateMany({ _id: { $in: maping } }, {
      $set: payload
    }, { multi: true }
    )

    for (let val of maping) {
      const result = await History.find({ case: val , 'delete_status' : { $ne: 'deleted'}})
        .sort(HISTORY_DEFAULT_SORT).limit(1).lean()
      await conditional(result, payload, val)
    }
    callback(null, updated)
  } catch (error) {
    callback(error, null)
  }
}

const caseSummaryCondition = (searching, sumFuncNoMatch) => {
  const conditions = [
    { $match: {
      $and: [  searching, { ...WHERE_GLOBAL, last_history: { $exists: true, $ne: null } } ]
    }},
    {
      $group: {
        _id: 'status',
        confirmed: sumFuncNoMatch([{ $eq: ['$status', CRITERIA.CONF] }]),
        probable: sumFuncNoMatch([{ $eq: ['$status', CRITERIA.PROB] }]),
        suspect: sumFuncNoMatch([{ $eq: ['$status', CRITERIA.SUS] }]),
        closeContact: sumFuncNoMatch([{ $eq: ['$status', CRITERIA.CLOSE] }]),
      },
    },{ $project: { _id : 0 } },
  ]

  return conditions
}

async function getCaseSummary(query, user, callback) {
  let condition
  if (user.unit_id) {
    condition = { unit_id: user.unit_id._id, role: ROLE.FASKES }
  } else {
    condition = { role: ROLE.FASKES }
  }
  try {
    clientConfig.get(`summary-cases-list-${user.username}`, async (err, result) => {
      const caseAuthors = await thisUnitCaseAuthors(user, condition)
      const scope = countByRole(user, caseAuthors)
      const filter = await filterCase(user, query)
      const searching = Object.assign(scope, filter)
      const { sumFuncNoMatch } = require('../helpers/aggregate/func')
      if(result){
        callback(null, JSON.parse(result))
      }else{
        const result = await Case.aggregate(caseSummaryCondition(searching, sumFuncNoMatch))
        const shiftResult = result.shift()
        clientConfig.setex(`summary-cases-list-${user.username}`, 15 * 60 * 1000, JSON.stringify(shiftResult)) // set redis key
        callback(null, shiftResult)
      }
    })
  } catch (e) {
    callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.cases_other.multipleUpdate',
    method: multipleUpdate
  },
  {
    name: 'services.cases_other.getSummary',
    method: getCaseSummary
  },
]