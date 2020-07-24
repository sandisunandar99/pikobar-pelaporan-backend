'use strict'
const Case = require('../models/Case')
const { CRITERIA } = require('../helpers/constant')

async function countSectionTop(query, user, callback) {
  try {
    const conditions = [
      {
        "$facet": {
          'confrimed': [
            {
              $group: {
                _id: 'confrimed', total: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$status', CRITERIA.CONF] },
                        ]
                      }, 1, 0]
                  }
                }
              }
            }
          ],
          'still_sick': [
            {
              $group: {
                _id: 'still_sick', total: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$status', CRITERIA.CONF] },
                          { $eq: ['$final_result', '4'] }
                        ]
                      }, 1, 0]
                  }
                }
              }
            }
          ],
          'recovered': [
            {
              $group: {
                _id: 'recovered', total: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ['$status', CRITERIA.CONF] },
                          { $eq: ['$final_result', '1'] }
                        ]
                      }, 1, 0]
                  }
                }
              }
            }
          ],
          'decease': [
            {
              $group: {
                _id: 'decease', total: {
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
        }
      },
      {
        "$project": {
          "confrimed": "$confrimed",
          "still_sick": "$still_sick",
          "recovered": "$recovered",
          "decease": "$decease"
        }
      },
    ]
    const resultCount = await Case.aggregate(conditions)
    callback(null, resultCount)
  } catch (e) {
    callback(e, null)
  }
}

module.exports = [
  {
    name: 'services.case_dashboard.countSectionTop',
    method: countSectionTop,
  }
];

