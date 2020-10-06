const { matchWhere } = require("./globalcondtion")
const { grupFunc  } = require("./func")
const groupCondition = (query, searching, where, criteria) => {
  let matchs = matchWhere(query, searching, where, criteria)
  const paramsGender = [
    matchs,
    grupFunc("$gender")
  ]

  const paramsNationality = [
    matchs,
    grupFunc("$nationality")
  ]

  return {
    "gender": paramsGender,
    "nationality": paramsNationality
  }
}

module.exports = {
  groupCondition
}