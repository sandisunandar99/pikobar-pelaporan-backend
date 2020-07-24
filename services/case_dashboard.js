'use strict'
const Case = require('../models/Case')
const Check = require('../helpers/rolecheck')
const { CRITERIA, ROLE } = require('../helpers/constant')

async function countSectionTop(query, user, callback) {
  try {
    // If Faskes, retrieve all users in this faskes unit, 
    // all users in the same FASKES must have the same summary.
    // ** if only based on author, every an author in this unit(faskes) will be has a different summary)
    const caseAuthors = await thisUnitCaseAuthors(user)
    let searching = Check.countByRole(user, caseAuthors)

    if(user.role === ROLE.PROVINCE || user.role === ROLE.ADMIN){
      if(query.address_district_code){
        searching.address_district_code = query.address_district_code
      }
    }

    if(query.address_village_code){
      searching.address_village_code = query.address_village_code
    }

    if(query.address_subdistrict_code){
      searching.address_subdistrict_code = query.address_subdistrict_code
    }

    const conditions = [
      { $match: {
        $and: [  searching, { delete_status: { $ne: 'deleted' }, verified_status: 'verified' } ]
      }},
      { $lookup: {
        from: 'histories',
        localField: 'last_history',
        foreignField: '_id',
        as: 'last_history'
      }},
      { $unwind: '$last_history' },
      {
        "$facet": {
          'confrimed': [
            {
              $group: {
                _id: 'confrimed',
                sick_home: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$final_result', '4'] },
                          { $eq: ['$status', CRITERIA.CONF] },
                          { $eq: ['$last_history.current_location_type', 'RUMAH'] },
                        ]
                      }, 1, 0]
                  }
                },
                sick_hospital: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$final_result', '4'] },
                          { $eq: ['$status', CRITERIA.CONF] },
                          { $eq: ['$last_history.current_location_type', 'RS'] },
                        ]
                      }, 1, 0]
                  }
                },
                recovered: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$status', CRITERIA.CONF] },
                          { $eq: ['$final_result', '1'] }
                        ]
                      }, 1, 0]
                  }
                },
                decease: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$status', CRITERIA.CONF] },
                          { $eq: ['$final_result', '2'] }
                        ]
                      }, 1, 0]
                  }
                }
              }
            }
          ],
          'probable': [
            {
              $group: {
                _id: 'probable', 
                sick: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$final_result', '4'] },
                          { $eq: ['$status', CRITERIA.PROB] },
                        ]
                      }, 1, 0]
                  }
                },
                recovered: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$final_result', '1'] },
                          { $eq: ['$status', CRITERIA.PROB] },
                        ]
                      }, 1, 0]
                  }
                },
                decease: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$final_result', '2'] },
                          { $eq: ['$status', CRITERIA.PROB] },
                        ]
                      }, 1, 0]
                  }
                }
              }
            }
          ],
          'suspect': [
            {
              $group: {
                _id: 'suspect', 
                sick: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$final_result', '4'] },
                          { $eq: ['$status', CRITERIA.SUS] },
                        ]
                      }, 1, 0]
                  }
                },
                discarded: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$final_result', '3'] },
                          { $eq: ['$status', CRITERIA.SUS] },
                        ]
                      }, 1, 0]
                  }
                }
              }
            }
          ],
          'closeContact': [
            {
              $group: {
                _id: 'closeContact', 
                quarantine: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$final_result', '5'] },
                          { $eq: ['$status', CRITERIA.CLOSE] },
                        ]
                      }, 1, 0]
                  }
                },
                discarded: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$final_result', '1'] },
                          { $eq: ['$status', CRITERIA.CLOSE] },
                        ]
                      }, 1, 0]
                  }
                }
              }
            }
          ],
        }
      },
      {
        "$project": {
          "confrimed": "$confrimed",
          "probable": "$probable",
          "suspect": "$suspect",
          "closeContact": "$closeContact"
        }
      },
    ]
    const resultCount = await Case.aggregate(conditions)
    callback(null, resultCount)
  } catch (e) {
    callback(e, null)
  }
}

async function thisUnitCaseAuthors (user) {
  let caseAuthors = []
  if (user.role === ROLE.FASKES && user.unit_id) {
    caseAuthors = await User.find({unit_id: user.unit_id._id, role: 'faskes'}).select('_id')
    caseAuthors = caseAuthors.map(obj => obj._id)
  }
  return caseAuthors
}

module.exports = [
  {
    name: 'services.case_dashboard.countSectionTop',
    method: countSectionTop,
  }
]
