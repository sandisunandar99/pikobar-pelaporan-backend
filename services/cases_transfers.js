const helper = require('../helpers/casetransferhelper')
const mongoose = require('mongoose');
const { func } = require('joi');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/CaseTransfer');
const CaseTransfer = mongoose.model('CaseTransfer');

const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'itemsList',
  limit: 'perPage',
  page: 'currentPage',
  meta: '_meta'
};


async function ListCase (query, user, type, callback) {

  let search = {}
  let params = { is_hospital_case_last_status: true }
  
  if (query.transfer_status) {
    params.transfer_status = query.transfer_status
  }

  if (type == 'in') {
    params.transfer_to_unit_id = user.unit_id._id
  } else {
    params.transfer_from_unit_id = user.unit_id._id
  }

  if (query.search) {
    search.$or = [
      { id_case : new RegExp(query.search || '',"i") },
      { name: new RegExp(query.search || '', "i") },
      { nik: new RegExp(query.search || '', "i") }
    ]
  }

  const dbQuery = [
    { $match: params },
    { $lookup:
      {
        from: 'cases',
        let: {
          transferCaseId: "$transfer_case_id",
          tounit_id: "$transfer_to_unit_id",
          status: "$transfer_status"
        },
        pipeline: [
          { $match:
              { $expr:
                { $and:
                    [
                      { $eq: [ "$_id",  "$$transferCaseId" ] }
                    ],
                },
                ...search
              },
          }
        ],
        as: 'case'
      },
    },
    { $sort: {createdAt: - 1} },
    { $unwind: "$case" },
    {
      $group:
      {
        _id: "$transfer_case_id",
        data: { $first: "$$ROOT" }
      }
    },
    { $replaceRoot: { newRoot: "$data" } },
    { $sort: {createdAt: - 1} },
  ]
  
  try {
    const aggregate = CaseTransfer.aggregate(dbQuery)

    const results = await CaseTransfer.aggregatePaginate(aggregate,
    {
      page: query.page || 1,
      limit: query.limit || 3,
      customLabels: myCustomLabels
    })

    const response = {
      cases: results.itemsList,
      _meta: (() => {
        delete results.itemsList
        return results
      })()
    }

    callback(null, response)
  } catch (error) {
    callback(null, error)
  }
}

async function getCasetransfers (caseId, callback) {
  try {

    let transfers = await CaseTransfer
      .find({ transfer_case_id: caseId, is_hospital_case_last_status: true })
      .populate('transfer_last_history')
      .sort({ createdAt: 1 })

    transfers = transfers.map(transfers => transfers.toJSONFor())
    
    return callback(null, transfers)
  } catch (error) {
    return callback(null, error)
  }
}

async function createCaseTransfer (caseId, author, pre, payload, callback) {

  try {
    // insert transfer logs
    payload.transfer_status = 'pending'
    payload.transfer_from_unit_id = author.unit_id._id
    payload.transfer_from_unit_name = author.unit_id.name
    payload.transfer_last_history = pre.cases.last_history._id

    // update case transfer status
    const a = await Case.findOneAndUpdate({ _id: caseId}, {
      $set: {
        transfer_status: payload.transfer_status,
        transfer_to_unit_id: payload.transfer_to_unit_id  
      }
    })

    Object.assign(payload, {
      transfer_case_id: caseId,
      createdBy: author._id
    })

    const item = new CaseTransfer(payload)

    const caseTransfer = await item.save()
    
    return callback(null, caseTransfer)
  } catch (error) {
    console.log(error)
    return callback(null, error)
  }
}

async function processTransfer (lastTransferId, caseId, action, author, payload = {}, callback) {
  
  try {
    const detailCase = await Case.findById(caseId)
    const latestTransferred = await CaseTransfer.findById(lastTransferId)

    if(latestTransferred) {
      await helper.setFalseAllThisCaseTransferLogs(
        CaseTransfer,
        caseId,
        latestTransferred.transfer_from_unit_id
      )
    }

    let casePayload = await helper.buildUpdateCasePayload(
      action,
      author,
      caseId,
      payload,
      CaseTransfer,
      latestTransferred
    )

    let transferCasePayload = helper.buildTransferCasePaylod(
      detailCase,
      latestTransferred,
      author,
      payload
    )

    const { transfer_to_unit_name, ...caseUpdatePayload } = casePayload
    await Case.findOneAndUpdate({ _id: caseId }, {
      $set: caseUpdatePayload
    })
    
    if (action === 'abort') {
      casePayload.transfer_status = 'aborted'
      casePayload.transfer_to_unit_id = latestTransferred.transfer_to_unit_id
      casePayload.transfer_to_unit_name = latestTransferred.transfer_to_unit_name
    }

    const item = new CaseTransfer(Object.assign(casePayload, transferCasePayload))
    const results = await item.save()   

    return callback(null, results)
  } catch (error) {
    return callback(null, error)
  }
}

async function geTransferCaseSummary (query, type, user, callback) {
  let params = { is_hospital_case_last_status: true }

  if (type == 'in') {
    params.transfer_to_unit_id = user.unit_id._id
  } else {
    params.transfer_from_unit_id = user.unit_id._id
  }

  const dbQuery = [
    { $match: params },
    { $group: { _id: "$transfer_status", total: {$sum: 1}} }
  ]
  
  let result =  {
    'PENDING': 0, 
    'DECLINED': 0,
    'APPROVED': 0
  }

  CaseTransfer.aggregate(dbQuery).exec().then(async item => {

      item.forEach(function(item){
        if (item['_id'] == 'pending') {
          result.PENDING = item['total']
        }
        if (item['_id'] == 'declined') {
          result.DECLINED = item['total']
        }
        if (item['_id'] == 'approved') {
          result.APPROVED = item['total']
        }
      })

      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

function getTransferCaseById (id, callback) {
  CaseTransfer.findOne({_id: id})
    .exec()
    .then(cases => callback (null, cases))
    .catch(err => callback(err, null));
}

function getLastTransferCase (params, callback) {
  CaseTransfer.findOne(params)
    .sort({createdAt: -1})
    .exec()
    .then(cases => callback (null, cases))
    .catch(err => callback(err, null));
}

module.exports = [
  {
    name: 'services.casesTransfers.list',
    method: ListCase
  },
  {
    name: 'services.casesTransfers.get',
    method: getCasetransfers
  },
  {
    name: 'services.casesTransfers.create',
    method: createCaseTransfer
  },
  {
    name: 'services.casesTransfers.getById',
    method: getTransferCaseById
  },
  {
    name: 'services.casesTransfers.getLastTransferCase',
    method: getLastTransferCase
  },
  {
    name: 'services.casesTransfers.processTransfer',
    method: processTransfer
  },
  {
    name: 'services.casesTransfers.geTransferCaseSummary',
    method: geTransferCaseSummary
  },
];

