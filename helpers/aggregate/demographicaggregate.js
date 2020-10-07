const { filterStatus } = require("./globalcondtion")
const { sumFunc, sumBetweenFunc } = require("./func")
const demographicCondition = (grouping, query, criteria) => {
  let query_state = filterStatus(query, criteria)
  const paramsDemographic = {
    $group: {
      _id: grouping,
      wni: sumFunc("$nationality", "WNI"),
      wna: sumFunc("$nationality", "WNA"),
      male: sumFunc("$gender", "L"),
      female: sumFunc("$gender", "P"),
      under_five: sumBetweenFunc(query_state, "$gender", 0, 6),
      six_nine: sumBetweenFunc(query_state, "$gender", 5, 10),
      twenty_twenty_nine: sumBetweenFunc(query_state, "$gender", 19, 30),
      thirty_thirty_nine: sumBetweenFunc(query_state, "$gender", 29, 40),
    }
  }

  return paramsDemographic
}

module.exports = {
  demographicCondition
}