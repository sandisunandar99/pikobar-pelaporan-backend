const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/CaseReference');
const CaseReference = mongoose.model('CaseReference');

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')

require('../models/User')
const User = mongoose.model('User')


async function getCaseReferences (caseId, callback) {
  try {

    let references = await CaseReference
      .find({ case: caseId })
      .populate('referrer')
      .sort({ createdAt: 'desc'})

    references = references.map(references => references.toJSONFor())
    
    return callback(null, references)
  } catch (error) {
    return callback(null, error)
  }
}

async function createCaseReference (id, author, pre, payload, callback) {
  try {
    // insert verification logs
    payload.case = id
    payload.referrer = author._id

    const item = new CaseReference(payload)

    const caseReference = await item.save()
    
    return callback(null, caseReference)
  } catch (error) {
    return callback(null, error)
  }
}

module.exports = [
  {
    name: 'services.casesReferences.get',
    method: getCaseReferences
  },
  {
    name: 'services.casesReferences.create',
    method: createCaseReference
  },
];

