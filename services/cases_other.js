const Case = require('../models/Case')
const History = require('../models/History')
const ObjectId = require('mongodb').ObjectID
const { HISTORY_DEFAULT_SORT } = require('../helpers/constant')

const conditional = async (result, payload, val) => {
  if (result.length > 0) {
    result.map(async res => {
      const _id = res._id
      delete res._id;
      res.status = payload.status,
      res.stage = res.stage,
      res.final_result = payload.final_result,
      res.last_date_status_patient = payload.last_date_status_patient,
      res.current_location_type = res.current_location_type
      const getData = await History.create(res)
      await Case.updateOne({'_id': ObjectId(_id)}, {
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
    await Case.updateOne({'_id': ObjectId(val)}, {
      $set: { 'last_history': getData._id }}
    )
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
      const result = await History.find({ case: val })
        .where('delete_status').ne('deleted')
        .sort(HISTORY_DEFAULT_SORT).limit(1).lean()
      await conditional(result, payload, val)
    }
    callback(null, updated)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.cases_other.multipleUpdate',
    method: multipleUpdate
  }
]