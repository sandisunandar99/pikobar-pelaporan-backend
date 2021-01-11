const { sumActive, sumSick, sumCondition, sumFuncNoMatch } = require("./func")

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

const groupingRdt = (grouping) => {
  const params = {
    $group: {
      _id: grouping,
      rdt: sumFuncNoMatch([{ $eq: ["$tool_tester", "PCR"] }]),
      pcr: sumFuncNoMatch([{ $eq: ["$tool_tester", "RDT"] }]),
    }
  }

  return params
}

const date = new Date()
const getYear = date.getFullYear()
const rdtByMonth = () => {
  const params = [
    {
      $match: {
        createdAt: {
          "$gte": new Date(`${getYear}-01-01`).setHours(00, 00, 00),
          "$lt": new Date(`${getYear}-12-31`).setHours(23, 59, 59)
        }
      }
    },
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
    }, { $sort: { _id: 1 } },
  ]
  return params
}

module.exports = {
  groupingCondition, groupingRdt, rdtByMonth
}