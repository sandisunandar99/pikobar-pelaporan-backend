const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/CaseTransfer');
const CaseTransfer = mongoose.model('CaseTransfer');


async function getCasetransfers (caseId, callback) {
  try {

    let transfers = await CaseTransfer
      .find({ case_id: caseId })
      .populate('createdBy')
      .sort({ createdAt: 'desc'})

    transfers = transfers.map(transfers => transfers.toJSONFor())
    
    return callback(null, transfers)
  } catch (error) {
    return callback(null, error)
  }
}

async function createCaseTransfer (id, author, payload, callback) {
  try {

    // update case transfer status
    await Case.findOneAndUpdate({ _id: id}, {
      $set: { transfer_status: payload.transfer_status }
    })

    // insert transfer logs
    payload.case_id = id
    payload.createdBy = author._id

    const item = new CaseTransfer(payload)

    const caseTransfer = await item.save()
    
    return callback(null, caseTransfer)
  } catch (error) {
    return callback(null, error)
  }
}

module.exports = [
  {
    name: 'services.casesTransfers.get',
    method: getCasetransfers
  },
  {
    name: 'services.casesTransfers.create',
    method: createCaseTransfer
  },
];

