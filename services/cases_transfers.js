const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/CaseTransfer');
const CaseTransfer = mongoose.model('CaseTransfer');


async function getCasetransfers (caseId, callback) {
  try {

    let transfers = await CaseTransfer
      .find({ transfer_case_id: caseId })
      .populate('createdBy')
      .sort({ createdAt: 'desc'})

    transfers = transfers.map(transfers => transfers.toJSONFor())
    
    return callback(null, transfers)
  } catch (error) {
    return callback(null, error)
  }
}

async function createCaseTransfer (caseId, author, payload, callback) {
  try {

    // insert transfer logs
    payload.transfer_from_unit_id = author.unit_id

    if (payload.transfer_status === 'transferred') {

      const caseTransfer = await CaseTransfer.findOne({
        transfer_case_id: caseId,
        transfer_to_unit_id: author.unit_id,
        transfer_status: 'pending'
      })

      payload.transfer_from_unit_id = caseTransfer.transfer_from_unit_id
      payload.transfer_to_unit_id = caseTransfer.transfer_to_unit_id 
    }

    // update case transfer status
    await Case.findOneAndUpdate({ _id: caseId}, {
      $set: {
        transfer_status: payload.transfer_status,
        transfer_to_unit_id: payload.transfer_to_unit_id      
      }
    })

    payload.transfer_case_id = caseId
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

