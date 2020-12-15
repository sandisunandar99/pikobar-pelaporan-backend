const Case = require('../models/Case')
const ObjectId = require('mongodb').ObjectID

const multipleUpdate = async (payload, user, callback) => {
  try {
    const getId = payload.id_case
    delete payload.id_case

    const maping = getId.map(r => {
      return ObjectId(r)
    })

    const updated = await Case.updateMany({ _id: { $in : maping } },{
      $set: payload }, { multi: true }
    )

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