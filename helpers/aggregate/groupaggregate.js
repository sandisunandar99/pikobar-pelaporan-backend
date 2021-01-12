const { MONTH } = require("../constant")
const { sumActive, sumSick, sumCondition, sumFunc } = require("./func")

const groupingCondition = (grouping, query, criteria) => {
  const { filterNotGrouping } = require("./globalcondtion")
  const column = filterNotGrouping(query, criteria)
  const params = {
    $group: {
      _id: grouping,
      active: sumActive(column.status),
      sick_home: sumSick(column.status, "RUMAH"),
      sick_hospital: sumSick(column.status, ["RS", "OTHERS"]),
      recovered: sumCondition(column.status, "1"),
      decease: sumCondition(column.status, "2"),
    }
  }

  return params
}

const groupingRdt = (match, grouping) => {
  const params = {
    $group: {
      _id: grouping,
      rdt: sumFunc(match, [{ $eq: ["$tool_tester", "PCR"] }]),
      pcr: sumFunc(match, [{ $eq: ["$tool_tester", "RDT"] }]),
    }
  }

  return params
}

const field = {
  $addFields: {
    name: {
      $let: {
        vars: {
          monthsInString: [, ...MONTH.EN]
        },
        in: {
          $arrayElemAt: ['$$monthsInString', '$_id']
        }
      }
    }
  }
}

// const date = new Date()
// const getYear = date.getFullYear()
// {
//   createdAt: {
//     "$gte": new Date(`${getYear}-01-01`).setHours(00, 00, 00),
//     "$lt": new Date(`${getYear}-12-31`).setHours(23, 59, 59)
//   }
// }
const byMonth = (match) => {
  const params = [ match,
    {
      "$group": {
        "_id": { $month: '$createdAt' },
        "rdt": {
          $sum: {
            $cond: [{ $and: [{ $eq: ["$tool_tester", "RDT"] }] }, 1, 0]
          }
        }, "pcr": {
          $sum: {
            $cond: [{ $and: [{ $eq: ["$tool_tester", "PCR"] }] }, 1, 0]
          }
        },
      }
    }, { $sort: { _id: 1 } }, field
  ]
  return params
}

const filterEquivalent = (status, result) => {
  return {
    $sum: {
      $cond: [{ $and: [
        { $eq: ["$tool_tester", status] },
        { $eq: ["$final_result", result ] }
      ] }, 1, 0]
    }
  }
}

const byMonthRdt = (match, status) => {
  const params = [ match,
    {
      '$group': {
        '_id': { $month: '$createdAt' },
        'reaktif': filterEquivalent(status, 'REAKTIF'),
        'non_reaktif': filterEquivalent(status, 'NON REAKTIF'),
        'inkonkuslif': filterEquivalent(status, 'INKONKLUSIF')
      }
    }, { $sort: { _id: 1 } }, field
  ]
  return params
}

module.exports = {
  groupingCondition, groupingRdt, byMonth, byMonthRdt
}