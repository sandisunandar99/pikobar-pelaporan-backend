const InspectionSupport = require('../models/Case')
const ObjectId = require('mongodb').ObjectID
const { findGlobal, deleteGlobal } = require('../helpers/global/crud')

const labeling = (condition, payload) => {
  let updateSet = ''
  if (condition === 'update') {
    updateSet = 'inspection_support.$.'
  }
  return {
    [`${updateSet}inspection_type`]: payload.inspection_type,
    [`${updateSet}specimens_type`]: payload.specimens_type,
    [`${updateSet}inspection_date`]: payload.inspection_date,
    [`${updateSet}inspection_location`]: payload.inspection_location,
    [`${updateSet}is_other_location`]: payload.is_other_location,
    [`${updateSet}other_inspection_location`]: payload.other_inspection_location,
    [`${updateSet}get_specimens_to`]: payload.get_specimens_to,
    [`${updateSet}inspection_result`]: payload.inspection_result,
  }
}

const createInspectionSupport = async (payload, id_case, callback) => {
  try {
    const inserted = await InspectionSupport.updateOne(
      { '_id': ObjectId(id_case) },
      { $addToSet: { 'inspection_support': labeling('add', payload) } },
      { new: true })
    callback(null, inserted)
  } catch (error) {
    callback(error, null)
  }
}

const listInspectionSupport = async (id_case, callback) => {
  try {
    const id = id_case
    const result = await findGlobal(InspectionSupport, id, 'inspection_support')
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const updateInspectionSupport = async (id_inspection_support, payload, callback) => {
  try {
    const updated = await InspectionSupport.updateOne(
      {
        'inspection_support._id': ObjectId(id_inspection_support)
      },
      { $set: labeling('update', payload) },
      { new: true })
    callback(null, updated)
  } catch (error) {
    callback(error, null)
  }
}

const deleteInspectionSupport = async (id, callback) => {
  try {
    const deleted = await deleteGlobal(InspectionSupport, 'inspection_support', id)
    callback(null, deleted)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.inspection_support.create',
    method: createInspectionSupport
  }, {
    name: 'services.inspection_support.read',
    method: listInspectionSupport
  }, {
    name: 'services.inspection_support.update',
    method: updateInspectionSupport
  }, {
    name: 'services.inspection_support.delete',
    method: deleteInspectionSupport
  },
]

