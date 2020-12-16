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

module.exports = {
  groupingCondition, groupingRdt
}