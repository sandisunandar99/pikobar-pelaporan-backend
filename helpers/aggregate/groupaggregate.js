const { MONTH } = require("../constant")
const { sumActive, sumSick, sumCondition, sumFunc, sumFuncNoMatch } = require("./func")

const groupingCondition = (grouping, query, criteria) => {
  const { filterNotGrouping } = require("./globalcondtion")
  const column = filterNotGrouping(query, criteria)
  const params = {
    $group: {
      _id: grouping,
      name : { $addToSet: { id : '$address_district_code' } },
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
      rdt: sumFunc(match, "$tool_tester", "PCR"),
      pcr: sumFunc(match, "$tool_tester", "RDT"),
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

const byMonth = (match) => {
  const params = [ match,
    {
      "$group": {
        "_id": { $month: '$test_date' },
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
  const filter = [
    { $eq: ["$tool_tester", status] },
    { $eq: ["$final_result", result ] }
  ]
  return sumFuncNoMatch(filter)
}

const month = { $month: '$test_date' }

const byMonthRdt = (match, status) => {
  const params = [ match,
    {
      '$group': {
        '_id': { $month: '$test_date' },
        'reaktif': filterEquivalent(status, 'REAKTIF'),
        'non_reaktif': filterEquivalent(status, 'NON REAKTIF'),
        'inkonkuslif': filterEquivalent(status, 'INKONKLUSIF')
      }
    }, { $sort: { _id: 1 } }, field
  ]
  return params
}

const byMonthPcr = (match, status) => {
  const params = [ match,
    {
      '$group': {
        '_id': month,
        'positif': filterEquivalent(status, 'POSITIF'),
        'negaitf': filterEquivalent(status, 'NEGATIF'),
        'invalid': filterEquivalent(status, 'INVALID')
      }
    }, { $sort: { _id: 1 } }, field
  ]
  return params
}

module.exports = {
  groupingCondition, groupingRdt, byMonth, byMonthRdt, byMonthPcr
}