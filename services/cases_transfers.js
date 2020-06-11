const mongoose = require('mongoose');

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
  let params = {}
  let filterStatus = {}

  if (query.search) {
    params.$or = [
      { id_case : new RegExp(query.search || '',"i") },
      { name: new RegExp(query.search || '', "i") },
      { nik: new RegExp(query.search || '', "i") }
    ]
  }

  if (query.transfer_status) {
    // filterStatus = { $eq: ["$transfer_status", query.transfer_status] }
    params.transfer_status = query.transfer_status
  }

  if (type == 'in') {
    params.transfer_to_unit_id = user.unit_id
  } else {
    params.transfer_from_unit_id = user.unit_id
  }

  const dbQuery = [
    { $match: params },
    { $lookup:
      {
        from: 'casetransfers',
        let: { caseId: "$_id" },
        pipeline: [
           { $match:
              { $expr:
                 { $and:
                    [
                      { $eq: [ "$transfer_case_id",  "$$caseId" ] },
                    ]
                 },
              }
           },
           { $sort: {createdAt: -1} },
           { $limit : 1 }
        ],
        as: "caseTransfer"
      },
    },
    { $lookup:
      {
        from: 'users',
        localField: "author",
        foreignField: "_id",
        as: "author"
      },
    },
    { "$addFields": {
      "author": {
        "$map": {
          "input": "$author",
          "as": "auth",
          "in": {
            "_id": "$$auth._id",
            "username": "$$auth.username",
            "fullname": "$$auth.fullname",
            "code_district_city": "$$auth.code_district_city",
            "name_district_city": "$$auth.name_district_city"
          }
        } 
      }  
    }},
    { $unwind: "$author" },
    { $lookup:
      {
        from: 'histories',
        localField: "last_history",
        foreignField: "_id",
        as: "last_history"
      },
    },
    { $unwind: "$last_history" },
    { $unwind: "$caseTransfer" }
  ]

  try {
    const aggregate = Case.aggregate(dbQuery)

    const results = await Case.aggregatePaginate(aggregate,
    {
      page: query.page || 1,
      limit: query.limit || 3,
      customLabels: myCustomLabels
    })
    
    const response = {
      cases: results.itemsList.map(c => {
        // delete c.caseTransfer
        return c
      }),
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

  function getCaseTransfer(params) {
    return CaseTransfer.findOne(params).sort({ createdAt: -1 })
  }

  // TODO CLEAN UP
  try {
    
    let status = payload.transfer_status
    let to_unit_id= payload.transfer_to_unit_id
    let to_unit_name = payload.transfer_to_unit_name

    

    // insert transfer logs
    payload.transfer_from_unit_id = author.unit_id
    payload.transfer_from_unit_name = author.unit_name

    if (payload.transfer_status === 'transferred') {

      const caseTransfer = await getCaseTransfer({
        transfer_case_id: caseId,
        transfer_to_unit_id: author.unit_id,
        transfer_status: 'pending'
      })

      payload.transfer_from_unit_id = caseTransfer.transfer_from_unit_id
      payload.transfer_from_unit_name = caseTransfer.transfer_from_unit_name

      payload.transfer_to_unit_id = caseTransfer.transfer_to_unit_id
      payload.transfer_to_unit_name = caseTransfer.transfer_to_unit_name 
      to_unit_id = caseTransfer.transfer_to_unit_id
      to_unit_name = caseTransfer.transfer_to_unit_name

    } else if (payload.transfer_status === 'aborted') {

      status = null
      to_unit_id = null
      to_unit_name = null

      const latestTransferred = await getCaseTransfer({
        transfer_case_id: caseId,
        transfer_from_unit_id: { $ne: author.unit_id },
        transfer_status: 'transferred'
      })

      const latestAbortTransfer = await getCaseTransfer({
        transfer_case_id: caseId,
        transfer_from_unit_id:  author.unit_id,
      })

      if (latestTransferred) {
        status = latestTransferred.transfer_status
        to_unit_id = latestTransferred.transfer_to_unit_id
        to_unit_name = latestTransferred.transfer_to_unit_name
      }

      payload.transfer_from_unit_id = author.unit_id
      payload.transfer_from_unit_name = author.unit_name

      payload.transfer_to_unit_id = latestAbortTransfer.transfer_to_unit_id 
      payload.transfer_to_unit_name = latestAbortTransfer.transfer_to_unit_name

    }

    // update case transfer status
    await Case.findOneAndUpdate({ _id: caseId}, {
      $set: {
        transfer_status: status,
        transfer_to_unit_id: to_unit_id,
        transfer_to_unit_name: to_unit_name,      
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
    return callback(null, error)
  }
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
];

