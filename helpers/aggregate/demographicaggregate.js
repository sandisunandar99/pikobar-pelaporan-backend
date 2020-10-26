const { filterStatus, filterNotGrouping } = require("./globalcondtion")
const { sumFunc, sumBetweenFunc } = require("./func")
const demographicCondition = (grouping, query, criteria) => {
  let query_state = filterStatus(query, criteria)
  let status = filterNotGrouping(query, criteria)
  const paramsDemographic = {
    $group: {
      _id: grouping,
      wni: sumFunc("$status",status.status,"$nationality", "WNI"),
      wna: sumFunc("$status",status.status, "$nationality", "WNA"),
      male: sumFunc("$status",status.status, "$gender", "L"),
      female: sumFunc("$status",status.status, "$gender", "P"),
      under_five: sumBetweenFunc(query_state, "$age", 0, 6),
      six_nine: sumBetweenFunc(query_state, "$age", 5, 10),
      twenty_twenty_nine: sumBetweenFunc(query_state, "$age", 19, 30),
      thirty_thirty_nine: sumBetweenFunc(query_state, "$age", 29, 40),
    }
  }

  return paramsDemographic
}

module.exports = {
  demographicCondition
}