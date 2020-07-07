const custom = require('../helpers/custom')
const paginate = require('../helpers/paginate')
const CloseContact = require('../models/CloseContact')
const filters = require('../helpers/filter/closecontactfilter')

async function index (query, authorized, callback) {
  try {
    const sorts = (query.sort == "desc" ? { createdAt: "desc" } : custom.jsonParse(query.sort))
    const options = paginate.optionsLabel(query, sorts, [])
    const params = filters.filterCloseContact(query, authorized)
    const search_params = filters.filterSearch(query)
    const result = CloseContact.find(params).or(search_params).where('delete_status').ne('deleted')
    const paginateResult = await CloseContact.paginate(result, options)
    return callback(null, paginateResult)
  } catch (e) {
    return callback(e, null)
  }
}

async function getByCase (caseId, callback) {
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
    name: 'services.closeContacts.getByCase',
    method: getByCase
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
]

