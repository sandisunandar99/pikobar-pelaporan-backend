require('../models/User')
require('../models/CloseContact')
const mongoose = require('mongoose')
const custom = require('../helpers/custom')
const CloseContact = mongoose.model('CloseContact')

async function index (caseId, callback) {
  try {
    const results = await CloseContact.find({
      case: caseId,
      delete_status: { $ne: 'deleted' }
    })
    
    return callback(null, results)
  } catch (e) {
    return callback(e, null)
  }
}

async function show (id, callback) {
  try {
    const result = await CloseContact.findById(id)
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

async function create (caseId, authorized, payload, callback) {
  try {
    let result = new CloseContact(Object.assign(payload, {
      case: caseId,
      createdBy: authorized
    }))
    result = await result.save()

    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

async function softDelete (id, authorized, callback) {
  try {
    const payload = custom.deletedSave({}, authorized)
    const result = CloseContact.findByIdAndUpdate(id, payload)
    return callback(null, result)
  } catch (e) {
    return callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.closeContacts.index',
    method: index
  },
  {
    name: 'services.closeContacts.show',
    method: show
  },
  {
    name: 'services.closeContacts.delete',
    method: softDelete
  },
  {
    name: 'services.closeContacts.create',
    method: create
  }
];

