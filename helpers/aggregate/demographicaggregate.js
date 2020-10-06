const { filterStatus } = require("./globalcondtion")
const demographicCondition = (grouping, query, criteria) => {
  let query_state = filterStatus(query, criteria)
  const paramsDemographic = {
    $group: {
      _id: grouping,
      wni: {
        $sum: {
          $cond: [
            {
              $and: [
                query_state,
                { $eq: ["$nationality", "WNI"] }
              ],
            }, 1, 0]
        }
      },wna: {
        $sum: {
          $cond: [
            {
              $and: [
                query_state,
                { $eq: ["$nationality", "WNA"] }
              ],
            }, 1, 0]
        }
      },male: {
        $sum: {
          $cond: [
            {
              $and: [
                query_state,
                { $eq: ["$gender", "L"] }
              ],
            }, 1, 0]
        }
      },female: {
        $sum: {
          $cond: [
            {
              $and: [
                query_state,
                { $eq: ["$nationality", "P"] }
              ],
            }, 1, 0]
        }
      },under_five: {
        $sum: {
          $cond: [
            { $and: [
              query_state,
              { $gt: ["$age", 0 ] },
              { $lt: ["$age", 6] }
            ]
          } ,1, 0]
        }
      },six_nine: {
        $sum: {
          $cond: [
            { $and: [
              query_state,
              { $gt: ["$age", 5 ] },
              { $lt: ["$age", 10] }
            ]
          } ,1, 0]
        }
      },twenty_twenty_nine: {
        $sum: {
          $cond: [
            { $and: [
              query_state,
              { $gt: ["$age", 19 ] },
              { $lt: ["$age", 30] }
            ]
          } ,1, 0]
        }
      },thirty_thirty_nine: {
        $sum: {
          $cond: [
            { $and: [
              query_state,
              { $gt: ["$age", 29 ] },
              { $lt: ["$age", 40] }
            ]
          } ,1, 0]
        }
      }
    }
  }

  return paramsDemographic
}

module.exports = {
  demographicCondition
}